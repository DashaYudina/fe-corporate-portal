import { Component, OnInit } from '@angular/core';
import {DocumentService} from '../../services/document.service';
import {first} from 'rxjs/operators';
import {Document} from '../../models/document';
import {Response} from '../../models/response';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Resolution} from '../../models/resolution';
import {UserStorageService} from '../../services/user-storage.service';
import {ResolutionAction} from '../../models/resolution-action';
import {RESOLUTION_ACTIONS_MOCKS} from '../../consts/mocks/resolution-action';

const resolutionFormControlName = 'resolutionFormControlName';
const commentFormControlName = 'commentFormControlName';

@Component({
  selector: 'fe-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  readonly resolutionFormGroup: FormGroup = new FormGroup({
    resolutionFormControlName: new FormControl('', Validators.required),
    commentFormControlName: new FormControl(''),
  });
  readonly commentAreaId = 'commentAreaId';

  document: Document |null = null;
  response: string | null = null;

  readonly resolutions: ResolutionAction[] = RESOLUTION_ACTIONS_MOCKS;

  constructor(private documentService: DocumentService, private userStorageService: UserStorageService) { }

  get resolutionFormControl(): FormControl {
    return this.resolutionFormGroup.get(resolutionFormControlName) as FormControl;
  }

  get commentFormControl(): FormControl {
    return this.resolutionFormGroup.get(commentFormControlName) as FormControl;
  }

  get isInvalidResolutionForm(): boolean {
    return this.resolutionFormGroup.invalid;
  }

  ngOnInit(): void {
    this.loadDocument();
  }

  loadDocument() {
    this.documentService.getDocument(this.getDocumentId())
      .pipe(first())
      .subscribe((document: Document) => {
        this.document = document;
        this.response = null;
      }, (error: string) => {
        console.error(error);
      });
  }

  approve(state: number) {
    const resolution: Resolution = {
      approver: this.userStorageService.user.email,
      resolution: this.resolutionFormControl.value,
      comment: this.commentFormControl.value,
      state
    };

    console.log(resolution);

    this.documentService.approveDocument(resolution).pipe(first()).subscribe((response: Response) => {
      this.response = response.message;
    });
  }

  private getDocumentId(): number {
    return this.userStorageService.user.documentId;
  }
}