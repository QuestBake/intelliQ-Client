import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { Observable } from 'rxjs';
import { Question } from 'src/app/_models/question.model';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { QuestionRequestService } from 'src/app/_services/questionRequest.service';
import { UtilityService } from 'src/app/_services/utility.service';
import { QuestionStatus, RoleType } from 'src/app/_models/enums';
import { QuesRequest } from 'src/app/_dto/ques-request.dto';

@Component({
	selector: 'app-view-questions',
	templateUrl: './view-questions.component.html',
	styleUrls: [ './view-questions.component.css' ]
})
export class ViewQuestionsComponent implements OnInit {
	isAllQuestions = false;
	loggedInUser: User;
	userQuestions$: Observable<Question[]>;
	allQuestions$: Observable<Question[]>;
	selectedQuestion: Question;
	tempSelectedQuestion: Question;
	userPageIndex = 0;
	allPageIndex = 0;
	editMode = false;
	tags: string;
	constructor(
		private localStorageService: LocalStorageService,
		private quesRequestService: QuestionRequestService,
		private utilityService: UtilityService
	) {}

	ngOnInit() {
		this.loggedInUser = this.localStorageService.getCurrentUser();
		this.userQuestions$ = this.quesRequestService.viewQuestionRequests(
			this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.userPageIndex)
		);
		this.allQuestions$ = this.quesRequestService.viewAllApprovedQuestion(
			this.createQuesRequestDto(this.loggedInUser, QuestionStatus.APPROVED, this.allPageIndex)
		);
	}
	createQuesRequestDto(user: User, status: QuestionStatus, pageIndex: number): QuesRequest {
		var quesRequest = new QuesRequest();
		quesRequest.userID = user.userId;
		quesRequest.groupCode = user.school.group.code;
		quesRequest.page = pageIndex;
		quesRequest.schoolID = user.school.schoolId;
		quesRequest.standards = user.roles[this.utilityService.findRoleIndex(user.roles, RoleType.TEACHER)].stds;
		quesRequest.status = status;
		return quesRequest;
	}

	onAllTabClick() {
		this.editMode = false;
		this.selectedQuestion = null;
		this.isAllQuestions = true;
	}
	deleteQuestion() {
		this.quesRequestService.deleteQuestionRequest(this.selectedQuestion).subscribe((response) => {
			if (response) {
				document.getElementById(this.selectedQuestion.quesId).hidden = true;
				this.selectedQuestion = null;
			}
		});
	}
	onEditClicked() {
		this.editMode = true;
		this.tempSelectedQuestion = this.selectedQuestion;
		this.tags = this.tempSelectedQuestion.tags ? this.tempSelectedQuestion.tags.toString() : '';
	}
	updateQuestion() {
		this.tempSelectedQuestion.tags = this.tags.split(',');
		this.quesRequestService.updateQuestion(this.tempSelectedQuestion).subscribe((response) => {
			if (response) {
				this.selectedQuestion = null;
				this.editMode = false;
			}
		});
	}
}
