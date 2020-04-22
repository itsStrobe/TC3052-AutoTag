import { Component, EventEmitter, OnInit, OnChanges, SimpleChange, SimpleChanges, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Input } from '@angular/core';
import { Project, ProjectTypeUtil } from '../projects/project';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit, OnChanges {
  @Input() projects: Project[];
  @Output() projectSelected = new EventEmitter<Project>();
  cards = null;
  /** Based on the screen size, switch from standard to one column per row */
  columns = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 3;
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  setCards() {
    this.cards = this.projects.map(project => {
      return {
        title: project.name,
        rows: 1,
        cols: 1,
        created: project.created,
        lastUpdate: project.lastUpdate,
        description: project.description,
        projectType: ProjectTypeUtil.getProjectTypeName(project.type),
        project: project
      }
    });
  }

  ngOnInit() {
    this.setCards();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["projects"])
      this.setCards();
  }

  selectProject(project: Project) {
    this.projectSelected.emit(project)
  }
}
