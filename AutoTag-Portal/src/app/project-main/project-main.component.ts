import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project, ProjectTypeUtil } from '../projects/project';

const minTagPercentForAutoTag = 30;
const hundredPercent = 100;

@Component({
  selector: 'app-project-main',
  templateUrl: './project-main.component.html',
  styleUrls: ['./project-main.component.scss']
})
export class ProjectMainComponent implements OnInit {
  project: Project = this.data.project;
  projectType: string;
  completion: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ProjectMainComponent>) { }

  ngOnInit(): void {
    this.projectType = ProjectTypeUtil.getProjectTypeName(this.project.type);
    this.completion = Math.floor(this.project.numTaggedRows * 100 / this.project.numTotalRows);
  }

  autoTagDisabled() {
    return this.completion < minTagPercentForAutoTag;
  }

  exportDisabled() {
    return this.completion < hundredPercent;
  }

  getAutoTagTooltip() {
    if (this.autoTagDisabled) {
      return 'Tag at least 30% of the examples to enable';
    }
    return 'Tag examples automatically';
  }

  getExportTooltip() {
    if (this.exportDisabled) {
      return 'Tag all of the examples to enable';
    }
    return 'Download project as a JSON';
  }
}
