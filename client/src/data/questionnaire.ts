export interface QuestionOption {
  id: string;
  label: string;
  serviceWeights: Record<string, number>;
}

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: "single" | "multiple";
  options: QuestionOption[];
}

export const questionnaire: Question[] = [
  {
    id: "help-type",
    title: "What type of help is your client looking for?",
    description: "Select all categories that apply to their needs.",
    type: "multiple",
    options: [
      {
        id: "home-exterior",
        label: "Home Exterior (roof, driveway, outdoor)",
        serviceWeights: { "roofing": 3, "driveway": 3, "general-reno": 1 }
      },
      {
        id: "home-interior",
        label: "Home Interior (plumbing, renovations, repairs)",
        serviceWeights: { "plumbing": 3, "general-reno": 3 }
      },
      {
        id: "digital-tech",
        label: "Digital & Technology (internet, security, AI)",
        serviceWeights: { "digital-services": 3, "ai-assistance": 3 }
      },
      {
        id: "memories-media",
        label: "Memories & Media (photos, videos, digitization)",
        serviceWeights: { "digitizing": 5 }
      },
      {
        id: "financial",
        label: "Financial (mortgage, loans, financing)",
        serviceWeights: { "financing": 5 }
      },
      {
        id: "not-sure",
        label: "Not sure / Multiple needs",
        serviceWeights: { "custom": 2 }
      }
    ]
  },
  {
    id: "urgency",
    title: "How urgent is this project?",
    description: "This helps us prioritize and find the right solutions.",
    type: "single",
    options: [
      {
        id: "emergency",
        label: "Emergency - Needs immediate attention",
        serviceWeights: { "plumbing": 2, "roofing": 2 }
      },
      {
        id: "soon",
        label: "Soon - Within the next few weeks",
        serviceWeights: {}
      },
      {
        id: "planning",
        label: "Planning ahead - Next few months",
        serviceWeights: { "financing": 1, "general-reno": 1 }
      },
      {
        id: "exploring",
        label: "Just exploring options",
        serviceWeights: { "custom": 1 }
      }
    ]
  },
  {
    id: "specific-issues",
    title: "Which specific issues apply?",
    description: "Select all that apply to help narrow down recommendations.",
    type: "multiple",
    options: [
      {
        id: "water-damage",
        label: "Water damage or leaks",
        serviceWeights: { "plumbing": 4, "roofing": 3 }
      },
      {
        id: "security-concerns",
        label: "Security concerns",
        serviceWeights: { "digital-services": 4 }
      },
      {
        id: "outdated-tech",
        label: "Outdated technology or slow internet",
        serviceWeights: { "digital-services": 3, "ai-assistance": 2 }
      },
      {
        id: "curb-appeal",
        label: "Improve curb appeal / property value",
        serviceWeights: { "driveway": 3, "roofing": 2, "general-reno": 2 }
      },
      {
        id: "old-photos",
        label: "Old photos, VHS tapes, or home videos",
        serviceWeights: { "digitizing": 5 }
      },
      {
        id: "renovation",
        label: "Renovation or remodeling project",
        serviceWeights: { "general-reno": 4, "financing": 2 }
      },
      {
        id: "smart-home",
        label: "Interest in smart home / automation",
        serviceWeights: { "ai-assistance": 4, "digital-services": 2 }
      },
      {
        id: "financing-needed",
        label: "Need financing for home projects",
        serviceWeights: { "financing": 5 }
      }
    ]
  },
  {
    id: "budget",
    title: "What's the approximate budget range?",
    description: "This helps us recommend appropriate service packages.",
    type: "single",
    options: [
      {
        id: "small",
        label: "Under $500 - Small project",
        serviceWeights: { "plumbing": 1, "digitizing": 2 }
      },
      {
        id: "medium",
        label: "$500 - $2,000 - Medium project",
        serviceWeights: { "digital-services": 1, "ai-assistance": 1, "general-reno": 1 }
      },
      {
        id: "large",
        label: "$2,000 - $10,000 - Large project",
        serviceWeights: { "roofing": 1, "driveway": 1, "general-reno": 2 }
      },
      {
        id: "major",
        label: "Over $10,000 - Major investment",
        serviceWeights: { "financing": 2, "roofing": 2, "general-reno": 2 }
      },
      {
        id: "flexible",
        label: "Flexible / Not yet determined",
        serviceWeights: {}
      }
    ]
  },
  {
    id: "homeowner-status",
    title: "What's the client's homeowner status?",
    description: "This affects which services and financing options are available.",
    type: "single",
    options: [
      {
        id: "owner-longtime",
        label: "Homeowner - Owned for 5+ years",
        serviceWeights: { "financing": 2, "general-reno": 1 }
      },
      {
        id: "owner-recent",
        label: "Homeowner - Recently purchased",
        serviceWeights: { "digital-services": 1, "ai-assistance": 1 }
      },
      {
        id: "looking-to-buy",
        label: "Looking to buy a home",
        serviceWeights: { "financing": 4 }
      },
      {
        id: "renter",
        label: "Renter",
        serviceWeights: { "digitizing": 2, "ai-assistance": 2 }
      }
    ]
  }
];

export function calculateServiceScores(answers: Record<string, string | string[]>): Record<string, number> {
  const scores: Record<string, number> = {};

  questionnaire.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    const selectedOptionIds = Array.isArray(answer) ? answer : [answer];
    
    selectedOptionIds.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (option) {
        Object.entries(option.serviceWeights).forEach(([serviceId, weight]) => {
          scores[serviceId] = (scores[serviceId] || 0) + weight;
        });
      }
    });
  });

  return scores;
}

export function getTopServices(scores: Record<string, number>, limit: number = 3): string[] {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .filter(([_, score]) => score > 0)
    .map(([serviceId]) => serviceId);
}

export function generateInterestsSummary(answers: Record<string, string | string[]>): string {
  const parts: string[] = [];

  questionnaire.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    const selectedOptionIds = Array.isArray(answer) ? answer : [answer];
    const selectedLabels = selectedOptionIds
      .map((id) => question.options.find((o) => o.id === id)?.label)
      .filter(Boolean);

    if (selectedLabels.length > 0) {
      parts.push(selectedLabels.join(", "));
    }
  });

  return parts.join(". ");
}
