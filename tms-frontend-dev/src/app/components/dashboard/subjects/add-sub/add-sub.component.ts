import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SubjectsService } from 'app/services/subjects.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ManagePreferredLocationsComponent } from '../manage-preferred-locations/manage-preferred-locations.component';
import { AlertService } from 'app/services/alert.service';

interface APIResponse {
  success: boolean,
  data: any
}

@Component({
  selector: 'app-add-sub',
  templateUrl: './add-sub.component.html',
  styleUrls: ['./add-sub.component.scss']
})
export class AddSubComponent implements OnInit {

  public year: string;
  public semester: string;
  public name: string;
  public code: string;
  public lechours: number;
  public tutehours: number;
  public labhours: number;
  public evahours: number;
  public id : string;
  public isOnUpdate : boolean;

  private subjectId: string;
  constructor(
    private formBuilder: FormBuilder,
    private subjectsService: SubjectsService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.year = '';
    this.semester = '';
    this.name = '';
    this.code = '';
    this.lechours = 0;
    this.tutehours = 0;
    this.labhours = 0;
    this.evahours = 0;

    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.subjectId = params.id;
        this.isOnUpdate = true;
        this.subjectsService.viewSubjectById(params.id).subscribe((res: {data: any}) => {
          this.id = params.id;
          this.year = res.data.year;
          this.semester = res.data.semester;
          this.name = res.data.name;
          this.code = res.data.code;
          this.lechours = res.data.lechours;
          this.tutehours = res.data.tutehours;
          this.labhours = res.data.labhours;
          this.evahours = res.data.evahours;
          this.isOnUpdate = true;

        });
      }
    });
  }

  //Adding subjects
  addSubject() {
    
    this.subjectsService.addSubject(this.year, this.semester, this.name, this.code, this.lechours, this.tutehours, this.labhours, this.evahours ).subscribe(res => {
      console.log(res);
      this.alertService.showAlert('Success!', 'The room information was added successfully!', 'success');
      this.viewAllSubjects();    
    }, err => {
      this.alertService.showAlert('Unsuccessful', '', { duration: 2000 });
      console.log(err.message);
    });

    this.clear();
  }

  

  clear() {
    this.year = '';
    this.semester = '';
    this.name = '';
    this.code = '';
    this.lechours = 0;
    this.tutehours = 0;
    this.labhours = 0;
    this.evahours = 0;
  }

  //Updating subject Details
  updateSubject(){
    this.alertService.showConfirm('Update Subject?', 'This will save the changes you have made.', 'warning').then(result => {
        if (result.value) {
          this.subjectsService.updateSubjectById(this.id,
        {
          year: this.year,
          semester: this.semester,
          name: this.name,
          code: this.code,
          lechours: this.lechours,
          tutehours: this.tutehours,
          labhours: this.labhours,
          evahours: this.evahours
        }
      ).subscribe(res => {
        console.log(res);
        this.alertService.showAlert('Success!', 'The room information was updated successfully!', 'success');
        this.viewAllSubjects();
      });
    }
  });
}
  // this.alertService.showConfirm('Update Lecturer?', 'This will save the changes you have made.', 'warning').then(result => {
  //   if (result.value) {
  //     this.loading = true;
  //     this.lecturersService.updateLecturerById(this.id,
  //       {
  //               empid: this.empid,
  //               fname: this.fname,
  //               lname: this.lname,
  //               // email: this.email,
  //               faculty: this.faculty,
  //               department: this.department,
  //               center: this.center,
  //               building: this.building,
  //               level: this.level,
  //             }
  //       ).subscribe((response: APIResponse) => {
  //       this.alertService.showAlert('Success!', 'The room information was updated successfully!', 'success');
  //       this.viewAllLecturers();
  //     });
  //   }
  // });




  viewAllSubjects() {
    this.router.navigate(['/subjects/manage']);
  }
  

  openPreferredLocationsModal() {
    const ref = this.dialog.open(ManagePreferredLocationsComponent, {
      width: '50%',
      disableClose: true,
      data: {
        subjectId: this.subjectId
      }
    });
  }

}

