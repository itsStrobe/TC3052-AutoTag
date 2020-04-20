import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog'
import { ProjectsService } from './projects.service';
import { Project } from './project';
import { NewProjectComponent } from '../new-project/new-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'createDate', 'editDate', 'edit', 'delete'];

  projects = [];
  selectedProject: Project = new Project();
  loading = false;

  constructor(public projectsService: ProjectsService, public dialog: MatDialog) {
  }

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
    if (this.selectedProject.uuid !== undefined) {
      await this.projectsService.updateProject(this.selectedProject);
    } else {
      await this.projectsService.createProject(this.selectedProject);
    }
    this.selectedProject = new Project();
    await this.refresh();
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
    if (confirm(`Are you sure you want to delete the product ${project.name}. This cannot be undone.`)) {
      this.projectsService.deleteProject(project.uuid);
    }
    await this.refresh();
  }

  newProject() {
    let newProjectDialogRef = this.dialog.open(NewProjectComponent, new MatDialogConfig())
  }
  onProjectSelected(project: Project) {
    this.selectedProject = project;
  }
}
