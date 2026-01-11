import axios from "axios";
import crypto from "crypto";

const WITHINGS_API_BASE = "https://wbsapi.withings.net";
const WITHINGS_AUTH_URL = "https://account.withings.com/oauth2_user/authorize2";

function getHmacSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.WITHINGS_CLIENT_SECRET;
  if (!secret) {
    throw new Error("No secret available for HMAC signing");
  }
  return secret;
}

export function createSignedState(data: {
  ambassadorUserId: string;
  customerEmail: string;
  customerName: string;
  nonce: string;
}): string {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac("sha256", getHmacSecret());
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

export function verifyAndDecodeState(state: string): {
  ambassadorUserId: string;
  customerEmail: string;
  customerName: string;
  nonce: string;
} | null {
  try {
    const decoded = Buffer.from(state, "base64url").toString("utf-8");
    const { payload, signature } = JSON.parse(decoded);
    
    const hmac = crypto.createHmac("sha256", getHmacSecret());
    hmac.update(payload);
    const expectedSignature = hmac.digest("hex");
    
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      console.error("State signature verification failed");
      return null;
    }
    
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to decode state:", error);
    return null;
  }
}

export function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

interface WithingsTokenResponse {
  status: number;
  body: {
    userid: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
}

interface WithingsMeasurement {
  grpid: number;
  attrib: number;
  date: number;
  created: number;
  modified: number;
  category: number;
  deviceid: string;
  hash_deviceid: string;
  measures: Array<{
    value: number;
    type: number;
    unit: number;
  }>;
}

interface WithingsMeasureResponse {
  status: number;
  body: {
    updatetime: number;
    timezone: string;
    measuregrps: WithingsMeasurement[];
  };
}

interface WithingsActivityResponse {
  status: number;
  body: {
    activities: Array<{
      date: string;
      timezone: string;
      steps: number;
      distance: number;
      elevation: number;
      soft: number;
      moderate: number;
      intense: number;
      active: number;
      calories: number;
      totalcalories: number;
    }>;
  };
}

interface WithingsSleepResponse {
  status: number;
  body: {
    series: Array<{
      startdate: number;
      enddate: number;
      state: number;
      model: number;
    }>;
  };
}

const MEASURE_TYPES = {
  1: { name: "Weight", unit: "kg" },
  4: { name: "Height", unit: "m" },
  5: { name: "Fat Free Mass", unit: "kg" },
  6: { name: "Fat Ratio", unit: "%" },
  8: { name: "Fat Mass Weight", unit: "kg" },
  9: { name: "Diastolic Blood Pressure", unit: "mmHg" },
  10: { name: "Systolic Blood Pressure", unit: "mmHg" },
  11: { name: "Heart Pulse", unit: "bpm" },
  12: { name: "Temperature", unit: "°C" },
  54: { name: "SpO2", unit: "%" },
  71: { name: "Body Temperature", unit: "°C" },
  73: { name: "Skin Temperature", unit: "°C" },
  76: { name: "Muscle Mass", unit: "kg" },
  77: { name: "Hydration", unit: "kg" },
  88: { name: "Bone Mass", unit: "kg" },
  91: { name: "Pulse Wave Velocity", unit: "m/s" },
  123: { name: "VO2 Max", unit: "ml/min/kg" },
  135: { name: "Nerve Health Score", unit: "" },
  136: { name: "Vascular Age", unit: "years" },
  137: { name: "AFib Result", unit: "" },
  138: { name: "QRS Duration", unit: "ms" },
  139: { name: "PR Duration", unit: "ms" },
  140: { name: "QT Duration", unit: "ms" },
  141: { name: "QTc Duration", unit: "ms" },
};

export function getWithingsAuthUrl(redirectUri: string, state: string): string {
  const clientId = process.env.WITHINGS_CLIENT_ID;
  if (!clientId) {
    throw new Error("WITHINGS_CLIENT_ID not configured");
  }

  const scopes = [
    "user.info",
    "user.metrics",
    "user.activity",
  ].join(",");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state: state,
  });

  return `${WITHINGS_AUTH_URL}?${params.toString()}`;
}

export async function exchangeWithingsCode(
  code: string,
  redirectUri: string
): Promise<{
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  scope: string;
}> {
  const clientId = process.env.WITHINGS_CLIENT_ID;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Withings credentials not configured");
  }

  const params = new URLSearchParams({
    action: "requesttoken",
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  });

  const response = await axios.post<WithingsTokenResponse>(
    `${WITHINGS_API_BASE}/v2/oauth2`,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.data.status !== 0) {
    throw new Error(`Withings API error: status ${response.data.status}`);
  }

  const { userid, access_token, refresh_token, expires_in, scope } = response.data.body;

  return {
    userId: userid,
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: new Date(Date.now() + expires_in * 1000),
    scope: scope,
  };
}

export async function refreshWithingsToken(
  refreshToken: string
): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}> {
  const clientId = process.env.WITHINGS_CLIENT_ID;
  const clientSecret = process.env.WITHINGS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Withings credentials not configured");
  }

  const params = new URLSearchParams({
    action: "requesttoken",
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  });

  const response = await axios.post<WithingsTokenResponse>(
    `${WITHINGS_API_BASE}/v2/oauth2`,
    params.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (response.data.status !== 0) {
    throw new Error(`Withings API error: status ${response.data.status}`);
  }

  const { access_token, refresh_token, expires_in } = response.data.body;

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresAt: new Date(Date.now() + expires_in * 1000),
  };
}

export async function getWithingsMeasurements(
  accessToken: string,
  startDate?: Date,
  endDate?: Date
): Promise<Array<{
  date: Date;
  measurements: Array<{
    type: string;
    value: number;
    unit: string;
  }>;
}>> {
  const params: Record<string, string> = {
    action: "getmeas",
  };

  if (startDate) {
    params.startdate = Math.floor(startDate.getTime() / 1000).toString();
  }
  if (endDate) {
    params.enddate = Math.floor(endDate.getTime() / 1000).toString();
  }

  const response = await axios.get<WithingsMeasureResponse>(
    `${WITHINGS_API_BASE}/measure`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.status !== 0) {
    throw new Error(`Withings API error: status ${response.data.status}`);
  }

  return response.data.body.measuregrps.map((grp) => ({
    date: new Date(grp.date * 1000),
    measurements: grp.measures.map((m) => {
      const measureType = MEASURE_TYPES[m.type as keyof typeof MEASURE_TYPES] || {
        name: `Unknown (${m.type})`,
        unit: "",
      };
      return {
        type: measureType.name,
        value: m.value * Math.pow(10, m.unit),
        unit: measureType.unit,
      };
    }),
  }));
}

export async function getWithingsActivity(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{
  date: string;
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
}>> {
  const params = {
    action: "getactivity",
    startdateymd: startDate.toISOString().split("T")[0],
    enddateymd: endDate.toISOString().split("T")[0],
  };

  const response = await axios.get<WithingsActivityResponse>(
    `${WITHINGS_API_BASE}/v2/measure`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.status !== 0) {
    throw new Error(`Withings API error: status ${response.data.status}`);
  }

  return response.data.body.activities.map((a) => ({
    date: a.date,
    steps: a.steps,
    distance: a.distance,
    calories: a.totalcalories,
    activeMinutes: a.soft + a.moderate + a.intense,
  }));
}

export async function getWithingsSleep(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{
  start: Date;
  end: Date;
  durationMinutes: number;
  state: string;
}>> {
  const params = {
    action: "get",
    startdate: Math.floor(startDate.getTime() / 1000).toString(),
    enddate: Math.floor(endDate.getTime() / 1000).toString(),
  };

  const response = await axios.get<WithingsSleepResponse>(
    `${WITHINGS_API_BASE}/v2/sleep`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (response.data.status !== 0) {
    throw new Error(`Withings API error: status ${response.data.status}`);
  }

  const stateMap: Record<number, string> = {
    0: "Awake",
    1: "Light Sleep",
    2: "Deep Sleep",
    3: "REM Sleep",
  };

  return response.data.body.series.map((s) => ({
    start: new Date(s.startdate * 1000),
    end: new Date(s.enddate * 1000),
    durationMinutes: Math.round((s.enddate - s.startdate) / 60),
    state: stateMap[s.state] || "Unknown",
  }));
}

export interface WithingsHealthSummary {
  latestWeight?: { value: number; date: Date };
  latestBP?: { systolic: number; diastolic: number; pulse: number; date: Date };
  latestBodyComposition?: {
    fatRatio?: number;
    muscleMass?: number;
    boneMass?: number;
    hydration?: number;
    date: Date;
  };
  recentActivity: Array<{
    date: string;
    steps: number;
    calories: number;
  }>;
  sleepSummary?: {
    averageDuration: number;
    lastNightDuration: number;
  };
}

export async function getWithingsHealthSummary(
  accessToken: string
): Promise<WithingsHealthSummary> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const summary: WithingsHealthSummary = {
    recentActivity: [],
  };

  interface MeasurementItem {
    type: string;
    value: number;
    unit: string;
  }
  
  interface MeasurementGroup {
    date: Date;
    measurements: MeasurementItem[];
  }
  
  interface ActivityItem {
    date: string;
    steps: number;
    distance: number;
    calories: number;
    activeMinutes: number;
  }

  try {
    const measurements = await getWithingsMeasurements(accessToken, thirtyDaysAgo, now);
    
    for (const grp of measurements as MeasurementGroup[]) {
      for (const m of grp.measurements) {
        if (m.type === "Weight" && !summary.latestWeight) {
          summary.latestWeight = { value: m.value, date: grp.date };
        }
        if (m.type === "Systolic Blood Pressure") {
          const diastolic = grp.measurements.find((x: MeasurementItem) => x.type === "Diastolic Blood Pressure");
          const pulse = grp.measurements.find((x: MeasurementItem) => x.type === "Heart Pulse");
          if (diastolic && !summary.latestBP) {
            summary.latestBP = {
              systolic: m.value,
              diastolic: diastolic.value,
              pulse: pulse?.value || 0,
              date: grp.date,
            };
          }
        }
        if (m.type === "Fat Ratio" && !summary.latestBodyComposition) {
          const muscle = grp.measurements.find((x: MeasurementItem) => x.type === "Muscle Mass");
          const bone = grp.measurements.find((x: MeasurementItem) => x.type === "Bone Mass");
          const hydration = grp.measurements.find((x: MeasurementItem) => x.type === "Hydration");
          summary.latestBodyComposition = {
            fatRatio: m.value,
            muscleMass: muscle?.value,
            boneMass: bone?.value,
            hydration: hydration?.value,
            date: grp.date,
          };
        }
      }
    }
  } catch (error) {
    console.error("Error fetching Withings measurements:", error);
  }

  try {
    const activity = await getWithingsActivity(accessToken, sevenDaysAgo, now);
    summary.recentActivity = activity.map((a: ActivityItem) => ({
      date: a.date,
      steps: a.steps,
      calories: a.calories,
    }));
  } catch (error) {
    console.error("Error fetching Withings activity:", error);
  }

  return summary;
}
