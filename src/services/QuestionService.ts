import {Question} from '../models/Question';

export interface QuestionService {
  questionList: Question[];
  loadingQuestions: boolean;
  newQuestion: Question;
  fetching: boolean;

  submitQuestion(): Promise<void>;

}