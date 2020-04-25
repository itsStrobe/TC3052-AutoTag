import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Project } from '../projects/project';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent {
  project: Project = this.data.project;
  newProjectForm = this.fb.group({
    title: [this.project.name, Validators.required],
    description: [this.project.description, Validators.required]
  });

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateProjectComponent>) { }

  onDelete() {
    if (confirm('Are you sure you want to delete the project?')) {
      this.dialogRef.close({ project: null, delete: true });
    }
  }

  onSubmit() {
    this.project.name = this.newProjectForm.get('title').value;
    this.project.description = this.newProjectForm.get('description').value;
    this.dialogRef.close({ project: this.project, delete: false });
  }
}
