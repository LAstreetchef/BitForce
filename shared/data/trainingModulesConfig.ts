export interface ModuleConfig {
  id: number;
  title: string;
  lessonIds: string[];
}

export const TRAINING_MODULES_CONFIG: ModuleConfig[] = [
  {
    id: 1,
    title: "Welcome to the Team!",
    lessonIds: ["1-1", "1-2", "1-3", "1-4"],
  },
  {
    id: 2,
    title: "Communication Mastery",
    lessonIds: ["2-1", "2-2", "2-3", "2-4"],
  },
  {
    id: 3,
    title: "Know Your Services",
    lessonIds: ["3-1", "3-2", "3-3", "3-4"],
  },
  {
    id: 4,
    title: "Digital Tools & Apps",
    lessonIds: ["4-1", "4-2", "4-3"],
  },
  {
    id: 5,
    title: "Sales Psychology",
    lessonIds: ["5-1", "5-2", "5-3", "5-4"],
  },
  {
    id: 6,
    title: "Building Your Network",
    lessonIds: ["6-1", "6-2", "6-3"],
  },
  {
    id: 7,
    title: "Compliance & Ethics",
    lessonIds: ["7-1", "7-2", "7-3"],
  },
  {
    id: 8,
    title: "Advanced Strategies",
    lessonIds: ["8-1", "8-2", "8-3", "8-4"],
  },
  {
    id: 9,
    title: "Home Security Essentials",
    lessonIds: ["9-1", "9-2", "9-3"],
  },
  {
    id: 10,
    title: "Leadership & Team Building",
    lessonIds: ["10-1", "10-2", "10-3"],
  },
  {
    id: 11,
    title: "BFT & Crypto Essentials",
    lessonIds: ["11-1", "11-2", "11-3", "11-4"],
  },
];

export function getModuleConfig(moduleId: number): ModuleConfig | undefined {
  return TRAINING_MODULES_CONFIG.find((m) => m.id === moduleId);
}

export function isValidLesson(moduleId: number, lessonId: string): boolean {
  const module = getModuleConfig(moduleId);
  if (!module) return false;
  return module.lessonIds.includes(lessonId);
}

export function getTotalLessonsCount(): number {
  return TRAINING_MODULES_CONFIG.reduce((sum, m) => sum + m.lessonIds.length, 0);
}

export function getAllLessonIds(): string[] {
  return TRAINING_MODULES_CONFIG.flatMap((m) => m.lessonIds);
}
