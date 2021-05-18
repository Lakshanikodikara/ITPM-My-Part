import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { SessionsService } from "app/services/sessions.service";
import { Router } from "@angular/router";
import { MatSort } from "@angular/material/sort";
import { AlertService } from "app/services/alert.service";

interface APIResponse {
  success: boolean;
  data: any;
}

@Component({
  selector: "app-manage-sessions",
  templateUrl: "./manage-sessions.component.html",
  styleUrls: ["./manage-sessions.component.scss"],
})
export class ManageSessionsComponent implements OnInit {
  displayedColumns = [
    "selectedLecName",
    "selectedSubName",
    "selectedTag",
    "selectedGroup",
    "studentCount",
    "duration",
    "action",
  ];
  dataSource: MatTableDataSource<any>;
  private loading: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private sessionsService: SessionsService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.viewAllSessions();
  }

  updateSession(id: String) {
    this.router.navigate(['/sessions/add'], { queryParams: { id } });
  }

  clickMethod(id: String) {
    this.alertService.showConfirm('Are you sure?',
      id ?
        `This will delete the Session` :
        `This deletion is not reversible!`).then(result => {
          if (result.value) {
            this.loading = true;
            this.sessionsService.deleteSessionsById(id).subscribe((response: APIResponse) => {
              if (response.success) {
                this.alertService.showAlert('Deleted!',
                  id ?
                    `Session was delete successfully from the system` :
                    `Session was delete successfully`, 'success');
                this.viewAllSessions();
              }
            });
          }
        })

  }

  private filterPredicate = (data, filter: string) => {
    const accumulator = (currentTerm, key) => {
      return this.nestedFilterCheck(currentTerm, data, key);
    };
    const dataStr = Object.keys(data).reduce(accumulator, "").toLowerCase();
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) !== -1;
  };

  private nestedFilterCheck(applyFilter, data, key) {
    if (typeof data[key] === "object") {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          applyFilter = this.nestedFilterCheck(applyFilter, data[key], k);
        }
      }
    } else {
      applyFilter += data[key];
    }
    return applyFilter;
  }

  applyFilter(keyword) {
    this.dataSource.filter = keyword.trim().toLowerCase();
  }

  viewAllSessions() {
    this.sessionsService.viewSessions().subscribe((res: APIResponse) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.filterPredicate = this.filterPredicate;
      this.dataSource.sort = this.sort;
    });
  }
}
