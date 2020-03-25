import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from './projects.service';
import { Project } from './project';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'description', 'createDate', 'editDate', 'edit', 'delete'];
  dataSource = new MatTableDataSource<any>();

  selectedProject: Project = new Project();
  loading = false;

  constructor(public projectsService: ProjectsService) {
  }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.loading = true;
    const data = await this.projectsService.getProjects();
    this.dataSource.data = data;
    this.loading = false;
  }

  async updateProject() {
    if (this.selectedProject.id !== undefined) {
      await this.projectsService.updateProject(this.selectedProject);
    } else {
      await this.projectsService.createProject(this.selectedProject);
    }
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
      this.projectsService.deleteProject(project.id);
    }
    await this.refresh();
  }
}
