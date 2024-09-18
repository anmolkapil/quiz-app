import { z } from "zod";

const optionSchema = z.string();

const questionSchema = z.object({
  question: z.string(),
  options: z.array(optionSchema),
  answer: z.string(),
});

const quizSchema = z.object({
  title: z.string(),
  icon: z.string(),
  questions: z.array(questionSchema),
});

export const quizzesSchema = z.object({
  quizzes: z.array(quizSchema),
});

export type Option = z.infer<typeof optionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Quiz = z.infer<typeof quizSchema>;
export type Quizzes = z.infer<typeof quizzesSchema>;
