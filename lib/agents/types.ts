export type AgentType = 'tutor' | 'simulator' | 'advisor'

export interface AgentConfig {
  model: string
  systemPrompt: string
  temperature: number
  maxTokens: number
  useRag: boolean
}

export interface AgentContext {
  userId: string
  userName: string
  userAge: number
  familyContext: FamilyContext
  progress: UserProgress
  conversationHistory: Message[]
  simulationState?: SimulationState
}

export interface FamilyContext {
  monthlyBudgetRange: string
  location: string
  financialGoals: string[]
  typicalExpenses: { category: string; description: string }[]
}

export interface UserProgress {
  level: number
  xp: number
  streak: number
  completedLessons: string[]
  financialStats: {
    savingsHabit: number
    spendingWisdom: number
    investmentKnowledge: number
    taxUnderstanding: number
    budgetingSkill: number
  }
}

export interface SimulationState {
  virtualAge: number
  currentMonth: number
  currentYear: number
  job?: {
    title: string
    company: string
    monthlySalary: number
  }
  finances: {
    cash: number
    savings: number
    debt: number
  }
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AgentResponse {
  content: string
  suggestions?: string[]
  xpGained?: number
  lessonReference?: string
}
