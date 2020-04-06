import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Input } from '@angular/core';

@Component({
  selector: 'app-projects-dashboard',
  templateUrl: './projects-dashboard.component.html',
  styleUrls: ['./projects-dashboard.component.scss']
})
export class ProjectsDashboardComponent implements OnInit {
  projects = [{
    name: "project",
    description: "desc",
    createDate: new Date(),
    editDate: new Date()
  },
  {
    name: "project",
    description: "desc",
    createDate: new Date(),
    editDate: new Date()
  }];
  cards;
  
  /** Based on the screen size, switch from standard to one column per row */
  columns = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return 1;
      }
      return 3;
    })
  )

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
   this.cards = this.projects.map(function(project) {
      return {
        title: project.name,
        rows: 1,
        cols: 1,
        createDate: project.createDate,
        editDate: project.editDate,
        description: project.description
      }
    })
  }
}
