import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProjectTypeUtil, ProjectType } from '../projects/project';
import { FileUploadService } from '../file-upload/file-upload.service'

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  newProjectForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
    type: [null, Validators.required]
  });
  projectTypeNames: string[];

  constructor(private fb: FormBuilder, private uploadService: FileUploadService) { }

  ngOnInit() {
    // Get all numeric keys in `ProjectType` enum.
    let projectTypes = Object.keys(ProjectType)
                             .filter(key => !isNaN(Number(key)))
                             .map(Number)
    this.projectTypeNames = projectTypes.map(ProjectTypeUtil.getProjectTypeName)
  }

  onSubmit() {}
}
