// src/services/EmailService.ts

export const EmailService = {
  subscribeToNewsletter: async (
    email: string,
    preferences: {
      news: boolean;
      events: boolean;
      research: boolean;
      admissions: boolean;
    }
  ) => {
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  },
  unsubscribeFromNewsletter: async (email: string, token: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  },
};
