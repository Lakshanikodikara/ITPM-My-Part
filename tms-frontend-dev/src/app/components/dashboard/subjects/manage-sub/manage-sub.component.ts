import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectsService } from 'app/services/subjects.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'app/services/alert.service';

interface APIResponse {
  success : boolean,
  data : any
}

@Component({
  selector: 'app-manage-sub',
  templateUrl: './manage-sub.component.html',
  styleUrls: ['./manage-sub.component.scss']
})
export class ManageSubComponent implements OnInit {

  displayedColumns = ['subCode', 'subName','subYear','subSemester','subLecHours','subTuteHours','subLabHours','subEvaHours', 'action'];
  dataSource : MatTableDataSource< any >;
  private loading: boolean;
  private _id : string;
  private year: string;
  private semester: string;
  private name: string;
  private code: string;
  private lechours: number;
  private tutehours: number;
  private labhours: number;
  private evahours: number;
  private id: string;
  private subject: [];

  constructor(
    private subjectsService: SubjectsService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this._id = '';
    this.name = '';
    this.code = '';
    this.viewAllSubjects();
  }

  viewAllSubjects() {
    this.subjectsService.viewSubjects().subscribe((res: APIResponse) => {
      this.dataSource = new MatTableDataSource ( res.data ); 
    })
  }

  updateSubject(id: String) {
    this.router.navigate(['/subjects/add'], {queryParams: {id} });
  }

  deleteSubject(id: String){
    this.alertService.showConfirm('Are you sure?',
      id ?
        `This will delete the Subject` :
        `This deletion is not reversible!`).then(result => {
          if (result.value) {
            this.loading = true;
            this.subjectsService.deleteSubjectById(id).subscribe((response: APIResponse) => {
              if (response.success) {
                this.alertService.showAlert('Deleted!',
                  id ?
                    `Subject was delete successfully from the system` :
                    `Subject was delete successfully`, 'success');
                this.viewAllSubjects();
              }
            });
          }
        })
    
  }

  
}
