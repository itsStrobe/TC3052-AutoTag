import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ProjectsService } from './projects.service';
import { Project } from './project';
import { NewProjectComponent } from '../new-project/new-project.component';
import { FileUploadService } from '../file-upload/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateProjectComponent } from '../update-project/update-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects = [];
  selectedProject: Project = new Project();
  loading = false;

  constructor(public projectsService: ProjectsService, public fileUploadService: FileUploadService,
              public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    const data = await this.projectsService.getProjects();
    this.projects = data;
    this.loading = false;
  }

  async updateProject() {
    let updatedProject: Project;
    if (this.selectedProject.uuid !== undefined) {
      updatedProject = await this.projectsService.updateProject(this.selectedProject);
      // Only refresh if the task is to update the project. If a new project is created,
      // the page will be refreshed after document upload.
      await this.refresh();
    } else {
      this.loading = true;
      updatedProject = await this.projectsService.createProject(this.selectedProject);
    }
    this.selectedProject = new Project();
    return updatedProject;
  }

  async createProject() {
    await this.projectsService.createProject(this.selectedProject);
    this.selectedProject = new Project();
    await this.refresh();
  }

  editProject(project: Project) {
    this.selectedProject = project;
  }

  clearProject() {
    this.selectedProject = new Project();
  }

  async deleteProject(project: Project) {
    this.loading = true;
    this.projectsService.deleteProject(project.uuid);
    await this.refresh();
  }

  async uploadFiles(files: File[], uuid: string) {
    this.loading = true;
    await this.fileUploadService.uploadFiles(files, uuid);
    await this.refresh();
  }

  newProject() {
    const newProjectDialogRef = this.dialog.open(NewProjectComponent, new MatDialogConfig());
    let files: File[];
    newProjectDialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.selectedProject = result.project;
        files = result.files;
        console.log(files);
        const snackBarRef = this.snackBar.open(
          `Creating project "${this.selectedProject.name}" and uploading files. Please do not close this tab.`,
          'Dismiss');
        const newProject = await this.updateProject();
        this.uploadFiles(files, newProject.uuid);
      }
    });
  }

  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }

  onProjectUpdate(project: Project) {
    const projectUpdateDialogRef = this.dialog.open(UpdateProjectComponent, {
      data: {
        project
      }
    });

    projectUpdateDialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.delete) {
          const snackBarRef = this.snackBar.open(`Deleting project "${project.name}"`,
            'Dismiss');
          this.deleteProject(project);
        } else {
          const snackBarRef = this.snackBar.open(`Updating project "${project.name}"`,
            'Dismiss');
          this.selectedProject = result.project;
          this.updateProject();
        }
      }
    });
  }
}
