import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectTypeUtil, ProjectType, Project } from '../projects/project';
import { CustomValidators } from '../form-validators/custom-validators'
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FileUploadService } from '../file-upload/file-upload.service'
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  projectTypeNames: string[];
  files = [];
  tags: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  newProjectForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
    type: [null, Validators.required],
    tags: [this.tags, CustomValidators.validateRequired],
    files: [this.files, CustomValidators.validateRequired]
  });

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProjectComponent>) { }

  ngOnInit() {
    // Get all numeric keys in `ProjectType` enum.
    let projectTypes = Object.keys(ProjectType)
      .filter(key => !isNaN(Number(key)))
      .map(Number);
    this.projectTypeNames = projectTypes.map(ProjectTypeUtil.getProjectTypeName);

    this.newProjectForm.controls['tags'].setValue(this.tags);
    this.newProjectForm.controls['files'].setValue(this.files);
  }

  onClickFileUpload() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let i = 0; i < fileUpload.files.length; i++) {
        this.files.push({ name: fileUpload.files[i].name, data: fileUpload.files[i] });
        this.newProjectForm.controls['files'].updateValueAndValidity();
      }
    };
    fileUpload.click();
  }

  removeFile(file) {
    const index = this.files.indexOf(file);

    if (index >= 0) {
      this.files.splice(index, 1);
      this.newProjectForm.controls['files'].updateValueAndValidity();
    }
  }

  removeAllFiles() {
    this.files = [];
    this.newProjectForm.controls['files'].updateValueAndValidity();
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add tag
    if ((value || '').trim()) {
      this.newProjectForm.controls['tags'].setErrors(null);
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.newProjectForm.controls['tags'].updateValueAndValidity();
  }

  onSubmit() {
    let newProject = new Project()
    newProject.name = this.newProjectForm.get('title').value;
    newProject.description = this.newProjectForm.get('description').value;
    newProject.type = this.newProjectForm.get('type').value;
    newProject.tags = this.newProjectForm.get('tags').value;
    newProject.created = new Date();
    newProject.lastUpdate = new Date();
    newProject.dataFormat = "txt";

    let filesData = this.files.map(file => file.data);

    this.dialogRef.close({ project: newProject, files: filesData });
  }
}
