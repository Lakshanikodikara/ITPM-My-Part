import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LecturersService } from 'app/services/lecturers.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ManageSuitableRoomsComponent } from '../../locations/rooms/manage-suitable-rooms/manage-suitable-rooms.component';
import { AlertService } from 'app/services/alert.service';

interface APIResponse {
  success: boolean,
  data: any
}

@Component({
  selector: 'app-add-lec',
  templateUrl: './add-lec.component.html',
  styleUrls: ['./add-lec.component.scss']
})

export class AddLecComponent implements OnInit {
  private loading: boolean;

  public empid: string;
  public fname: string;
  public lname: string;
  // public email: string;
  public faculty: string;
  public department: string;
  public center: string;
  public building: string;
  public level: string;
  public id : string;
  public isOnUpdate : boolean;
  public rank : string;

  constructor( 
      private formBuilder: FormBuilder,
      private lecturersService: LecturersService,
      private snackbar: MatSnackBar,
      private route: ActivatedRoute,
      private router: Router,
      private dialog: MatDialog,
      private alertService: AlertService
    ) {}

  ngOnInit(): void {

    this.empid = '';
    this.fname = '';
    this.lname = '';
    // this.email = '';
    this.faculty = '';
    this.department = '';
    this.center = '';
    this.building = '';
    this.level = '';
    this.rank = '2.1000';
    
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.lecturersService.viewLecturerById(params.id).subscribe((res: {data: any}) => {
          this.id = params.id;
          this.empid = res.data.empid;
          this.fname = res.data.fname;
          this.lname = res.data.lname;
          // this.email = res.data.email;
          this.faculty = res.data.faculty;
          this.department = res.data.department;
          this.center= res.data.center;
          this.building = res.data.building;
          this.level = res.data.level;
          this.isOnUpdate = true;
        });
      } 
    });
  }

  //Adding Lecturers To The System
  addLecturer() {
    // this.alertService.showConfirm('Add Lecturer?', 'This will save the changes you have made.', 'warning').then(result => {
    //   if (result.value) {
        this.loading = true;
    this.lecturersService.addLecturer(this.empid, this.fname, this.lname, this.faculty, this.department, this.center, this.building, this.level,this.rank ).subscribe(res => {
        console.log(res);
        
       this.alertService.showAlert('Success!', 'The room information was added successfully!', 'success');
       this.viewAllLecturers();
      }, err => {
        this.alertService.showAlert('Unsuccessful', '', { duration: 2000 });
        console.log(err.message);
      });
      this.clear();
    
    // });
}


  

  clear() {
    this.empid = '';
    this.fname = '';
    this.lname = '';
    // this.email = '';
    this.faculty = '';
    this.department = '';
    this.center = '';
    this.building = '';
    this.level = '';
    this.rank = '';
  }

 

  //Updating Lecturer Details
  updateLecturer(){
    // if(confirm("Do you want to update this recode? ")) {
    //   this.lecturersService.updateLecturerById(
    //     this.id,
    //     {
    //       empid: this.empid,
    //       fname: this.fname,
    //       lname: this.lname,
    //       // email: this.email,
    //       faculty: this.faculty,
    //       department: this.department,
    //       center: this.center,
    //       building: this.building,
    //       level: this.level,
    //     }
    //   ).subscribe(res => {
    //     console.log(res);
    //     this.snackbar.open('Lecturer details are successfully updated', null, { duration : 2000});
    //     this.router.navigate(['/lecturers/manage']);
    //   }, err => {
    //     this.snackbar.open('Unsuccessfull', null, { duration : 2000});
    //     console.log(err.message);
    //   });
    
    // }
    this.alertService.showConfirm('Update Lecturer?', 'This will save the changes you have made.', 'warning').then(result => {
        if (result.value) {
          this.loading = true;
          this.lecturersService.updateLecturerById(this.id,
            {
                    empid: this.empid,
                    fname: this.fname,
                    lname: this.lname,
                    // email: this.email,
                    faculty: this.faculty,
                    department: this.department,
                    center: this.center,
                    building: this.building,
                    level: this.level,
                  }
            ).subscribe((response: APIResponse) => {
            this.alertService.showAlert('Success!', 'The room information was updated successfully!', 'success');
            this.viewAllLecturers();
          });
        }
      });
   }

   viewAllLecturers() {
    this.router.navigate(['/lecturers/manage']);
  }

  openSuitableRoomsComponent() {
    const ref = this.dialog.open(ManageSuitableRoomsComponent, {
      width: '50%',
      disableClose: true,
      data: {
        resource: 'lecturers',
        id: this.id
      }
    });
  }
}
