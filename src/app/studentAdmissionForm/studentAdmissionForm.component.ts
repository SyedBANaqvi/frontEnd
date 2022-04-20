import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { GenericService } from '../generic.services';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { countryInfo, StudentFormService } from '../studentForm.service';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { ActivatedRoute } from '@angular/router';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { MAT_DATE_FORMATS } from '@angular/material/core';


// export const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD-MM-YYYY',
//     monthYearLabel: 'MMMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY'
//   },
// };
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD MMM, YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-studentAdmissionForm',
  templateUrl: './studentAdmissionForm.component.html',
  styleUrls: ['./studentAdmissionForm.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class StudentAdmissionFormComponent implements OnInit {
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };
  actionBtn: string = 'Submit';
  isShown: boolean = false;
  public localImageUrl;
  public uploader: FileUploader = new FileUploader({});
  public fileFilter;
  id;
  studentForm: FormGroup;
  loaders: any = { box: true };



  passportLabels = [
    { key: 'Passport', value: 'Passport *' },
    { key: 'CNIC', value: 'CNIC/B-Form/Birth Cert *' },
  ];
  passportLabel = { key: 'CNIC', value: 'CNIC/B-Form/Birth Cert *' };
  date = new FormControl(new Date());
  years;
  serializedDate = new FormControl(new Date().getFullYear);
  selectedCountry: string = '';
  public pushCount = 0;
  isCnic = true;
  selected = null;
  minDate: Date;
  maxDate: Date;
  base64Img;
  sendingImg;
  studentInfo;
  interface = {
    view: false,
    create: false,
    edit: false,
  };
  constructor(
    public sanitizer: DomSanitizer,
    private StudentData: GenericService,
    private studentInfoService: StudentFormService,
    private route: ActivatedRoute
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 40, 0, 1);
    this.maxDate = new Date(currentYear - 15, 11, 31);
  }

  months: string[] = ['JAN','FEB', 'MAR','APR','MAY','JUN','JUL', 'AUG','SEP','OCT','NOV','DEC'];
  d = new Date();
  name = this.months[this.d.getMonth()];
  getYears() {
    let years = [];
    for (let i = 2018; i <= new Date().getFullYear() + 1; i++) {
      years.push(i);
    }
    this.years = years;
  }


  data: countryInfo[] = [];
  columnToDisplay = ['code', 'abbreviation'];

  x: any = null;
  city: any = null;
  province: any = null;
  admissionType: any = null;
  academicSession: any = null;
  get studentRecordControls() {
    return (<FormArray>this.studentForm.get('studentRecord')).controls;
  }

  ngOnInit(): void {
    this.getYears();
    this.getDataFromApi();
    this.getDataFromCampus();
    this.getDataFromConfiguration();
    this.getDataFromAdmissionTypes();
    this.getDataFromAcademicSession();
    this.getDataFromProvince();

    this.id = this.route;

    this.studentForm = new FormGroup({
      uploadImage: new FormControl(''),
      campusId: new FormControl(''),
      session: new FormControl(''),
      programDetailId: new FormControl(Validators.required),
      month: new FormControl(this.months[new Date().getMonth()],Validators.required),
      year: new FormControl(new Date().getFullYear(), Validators.required),

      admissionDate: new FormControl( new Date().toISOString(),Validators.required),
      name: new FormControl(null, [Validators.required,Validators.pattern('[a-zA-Z]+([ ]+[a-zA-Z]*)*'),]),
      dob: new FormControl(null, Validators.required),
      gender: new FormControl('male', Validators.required),
      markOfIdentification: new FormControl(null, [Validators.required,Validators.pattern('[a-zA-Z]+([ ]+[a-zA-Z]*)*'),]),
      countryCode: new FormControl(null, Validators.required),
      mobileNumber: new FormControl(null, [Validators.required,Validators.pattern('[0-9 ()-]*'),]),
      email: new FormControl(null, [Validators.required,Validators.email,Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),]),
      cnicType: new FormControl('CNIC'),
      cnicId: new FormControl(null, [Validators.required,Validators.pattern('[0-9 -]*'),]),
      passport: new FormControl(null),
      religion: new FormControl(null, [Validators.pattern('[a-zA-Z]+([ ]+[a-zA-Z]*)*'),]),
      nationality: new FormControl(null, [Validators.required,Validators.pattern('[a-zA-Z]+([ ]+[a-zA-Z]*)*'),]),
      emergencyContactCode: new FormControl(null, Validators.required),
      emergencyContactNumber: new FormControl(null, [Validators.required, Validators.pattern('[0-9 ()-]*'),]),
      postalCity: new FormControl(''),
      postalAddress: new FormControl(null, [Validators.required,Validators.minLength(10), Validators.maxLength(200),]),
      permanentCity: new FormControl(''),
      permanentAddress: new FormControl(null, [ Validators.required, Validators.minLength(10),Validators.maxLength(200),]),
      domicileCity: new FormControl(''),
      domicileProvince: new FormControl(''),
      domicileTehsil: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern('[a-zA-Z]+([ ]+[a-zA-Z]*)*'),]),
      admissionType: new FormControl(''),
      guardianType: new FormControl('father'),
      guardianName: new FormControl(''),
      guardianCnic: new FormControl(null, [ Validators.required, Validators.pattern('[0-9 -]*'),]),
      guardianCountry: new FormControl(null, Validators.required),
      guardianMobileNumber: new FormControl(null, [Validators.required,Validators.pattern('[0-9 ()-]*'),]),
      studentAcademicRecord: new FormArray([]),});

      let formArr = this.studentForm.get('studentAcademicRecord') as FormArray;

        formArr.push(new FormGroup({
        id: new FormControl(null),
        rollNo: new FormControl(null, [Validators.required]),
        obtainedMarks: new FormControl(null, [Validators.required]),
        percentage: new FormControl(null, [Validators.required]),
        board: new FormControl(null, [Validators.required]),
      })
    );

    this.studentForm.valueChanges.subscribe((e) => {});
    this.uploader.onAfterAddingFile = (fileItem) => {
    const latestFile = this.uploader.queue[this.uploader.queue.length - 1];
    this.uploader.queue = [];
    this.uploader.queue.push(latestFile);
    const url = window.URL
        ? window.URL.createObjectURL(fileItem._file)
        : (window as any).webkitURL.createObjectURL(fileItem._file);

      this.localImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${url}`
      );
      this.localImageUrl = 'url(' + this.localImageUrl['changingThisBreaksApplicationSecurity'] + ')';
    };

    this.route.params.subscribe((val) => {
      this.id = val.id;
      console.log(this.route);
      let path = this.route.snapshot.routeConfig.path;

      let tempPath = path.split('/');

      if (tempPath[0] == 'view') {
        console.log('view');
        this.interface.view = true;
        this.StudentData.get(
          'studentForm/findStudentRecord/' + this.id
        ).subscribe((res) => {
          this.StudentData.getPicture(
            'studentForm/picture/' + this.id
          ).subscribe((rest: Blob) => {
            res['postalCity'] = parseInt(res['postalCity']);
            res['permanentCity'] = parseInt(res['permanentCity']);
            res['domicileCity'] = parseInt(res['domicileCity']);
            res['domicileProvince'] = parseInt(res['domicileProvince']);
            res['admissionType'] = parseInt(res['admissionType']);
            res['countryCode'] = parseInt(res['countryCode']);
            res['emergencyContactCode'] = parseInt(res['emergencyContactCode']);
            res['guardianCountry'] = parseInt(res['guardianCountry']);
            res['year'] = parseInt(res['year']);

            let urlCreator = window.URL;

            var imageUrl = urlCreator.createObjectURL(rest);

            this.localImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `${imageUrl}`
            );
            // this.localImageUrl = 'url(' + this.localImageUrl['changingThisBreaksApplicationSecurity'] + ')';
            this.studentInfo = res;
            let formArr = this.studentForm.get(
              'studentAcademicRecord'
            ) as FormArray;
            if (this.interface.view == true) {
              for (
                let i = 0;
                i < this.studentInfo.studentAcademicRecord.length - 1;
                i++
              ) {
                formArr.push(
                  new FormGroup({
                    id: new FormControl(null),
                    rollNo: new FormControl(null, [Validators.required]),
                    obtainedMarks: new FormControl(null, [Validators.required]),
                    percentage: new FormControl(null, [Validators.required]),
                    board: new FormControl(null, [Validators.required]),
                  })
                );
              }
              this.disableForm();
            }
            this.studentForm.patchValue(res);
          });
        });

        this.disableForm();

      } else if (tempPath[0] == 'edit') {
        console.log('edit');
        this.interface.edit = true;
        this.actionBtn = 'Save';
        this.StudentData.get(
          'studentForm/findStudentRecord/' + this.id
        ).subscribe((res) => {
          this.StudentData.getPicture(
            'studentForm/picture/' + this.id
          ).subscribe((rest: Blob) => {
            res['postalCity'] = parseInt(res['postalCity']);
            res['permanentCity'] = parseInt(res['permanentCity']);
            res['domicileCity'] = parseInt(res['domicileCity']);
            res['domicileProvince'] = parseInt(res['domicileProvince']);
            res['admissionType'] = parseInt(res['admissionType']);
            res['countryCode'] = parseInt(res['countryCode']);
            res['emergencyContactCode'] = parseInt(res['emergencyContactCode']);
            res['guardianCountry'] = parseInt(res['guardianCountry']);
            res['year'] = parseInt(res['year']);

            let urlCreator = window.URL;

            var imageUrl = urlCreator.createObjectURL(rest);

            this.localImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `${imageUrl}`
            );

            this.localImageUrl = 'url(' + this.localImageUrl['changingThisBreaksApplicationSecurity'] + ')';
            this.studentInfo = res;
            let formArr = this.studentForm.get(
              'studentAcademicRecord'
            ) as FormArray;
            if (this.interface.edit == true) {
              for (
                let i = 0;
                i < this.studentInfo.studentAcademicRecord.length - 1;
                i++
              ) {
                formArr.push(
                  new FormGroup({
                    id: new FormControl(null),
                    rollNo: new FormControl(null, [Validators.required]),
                    obtainedMarks: new FormControl(null, [Validators.required]),
                    percentage: new FormControl(null, [Validators.required]),
                    board: new FormControl(null, [Validators.required]),
                  })
                );
              }
            }
            this.studentForm.patchValue(res);
          });
        });

      } else {
        console.log('create');
        this.interface.create = true;
      }
    });
  }

  disableForm() {
    this.studentForm.disable();
  }
  phoneMask = [
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];
  CNICMask = [
    /[1-9]/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
  ];

  passportMask = [/[A-Z]/, /[A-Z]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  changeType(val) {

    this.passportLabel = this.passportLabels.find((e) => e['key'] == val);

    this.isCnic = !this.isCnic;

    if (this.isCnic == true) {
      this.studentForm.get('passport').setValidators(null);
      this.studentForm.get('cnicId').setValidators([Validators.required, Validators.pattern('[0-9 -]*')]);
      this.studentForm.get('passport').setValue(null);
    } else {
      this.studentForm.get('cnicId').setValidators(null);
      this.studentForm.get('passport').setValidators([ Validators.required,Validators.pattern('[A-Z]{2}[0-9]{7}'),]);
      this.studentForm.get('cnicId').setValue(null);
    }
  }

  getDataFromApi() {
    this.studentInfoService.getData().subscribe((x) => {
      this.data = x;

      this.studentForm.get('countryCode').setValue(this.data[0].id);
      this.studentForm.get('emergencyContactCode').setValue(this.data[0].id);
      this.studentForm.get('guardianCountry').setValue(this.data[0].id);
    });
  }

  getDataFromCampus() {
    this.studentInfoService.getCampus().then((data1) => {
      this.x = data1;
    });
  }

  programDetail(i, detail, programName) {
    if (this.studentInfo) {
      this.studentInfo.programDetailId = detail.id;
    } else {
      this.studentForm.get('programDetailId').patchValue(detail.id);
    }

    this.selected = { index: i, detail, programName };
  }
  getDataFromConfiguration() {
    this.studentInfoService.getCities().subscribe((e) => {
      this.city = e;
    });
  }

  getDataFromProvince() {
    this.studentInfoService.getProvince().subscribe((e) => {
      this.province = e;
    });
  }
  getDataFromAdmissionTypes() {
    this.studentInfoService.getAdmissionTypes().subscribe((e) => {
      this.admissionType = e;
    });
  }
  getDataFromAcademicSession() {
    this.studentInfoService.getAcademicSession().subscribe((e) => {
      this.academicSession = e;
    });
  }
  checkSelction(id) {
    return 'selected';
  }

  OnAddRecord() {
    if (this.interface.view == true) {
      this.isShown = !this.isShown;
    } else if (this.interface.edit == true) {
      this.interface.edit == true;
      if (this.pushCount <= 2) {
        this.pushCount++;
        let formArr = this.studentForm.get(
          'studentAcademicRecord'
        ) as FormArray;
        formArr.push(
          new FormGroup({
            id: new FormControl(null),
            rollNo: new FormControl(null, [Validators.required]),
            obtainedMarks: new FormControl(null, [Validators.required]),
            percentage: new FormControl(null, [Validators.required]),
            board: new FormControl(null, [Validators.required]),
          })
        );
      }
    } else {
      this.interface.create == true;
      if (this.pushCount <= 2) {
        this.pushCount++;
        let formArr = this.studentForm.get(
          'studentAcademicRecord'
        ) as FormArray;
        formArr.push(
          new FormGroup({
            id: new FormControl(null),
            rollNo: new FormControl(null, [Validators.required]),
            obtainedMarks: new FormControl(null, [Validators.required]),
            percentage: new FormControl(null, [Validators.required]),
            board: new FormControl(null, [Validators.required]),
          })
        );
      }
    }
  }
  OnRemoveRecord(i: number) {
    if (this.interface.view == true) {
      this.isShown = !this.isShown;
    } else if (this.interface.edit == true) {
      (<FormArray>this.studentForm.get('studentAcademicRecord')).removeAt(i);
    } else {
      (<FormArray>this.studentForm.get('studentAcademicRecord')).removeAt(i);
    }
  }

  OnSubmit() {
    if (this.interface.view == true) {
      this.isShown = !this.isShown;
    } else if (this.interface.edit == true) {
      let pd = this.studentForm.getRawValue();
      pd['date'] = this.toDateOnly(new Date(pd['admissionDate']));
      pd['DOB'] = this.toDateOnly(new Date(pd['dob']));
      pd['programDetailId'] = this.studentInfo.programDetailId;

      this.loaders.box = true;

      alert('test bf call');
      this.createStudentRecord(pd).then((res) => {
        alert('data done');
      });
    } else {
      this.interface.create == true;

      let pd = this.studentForm.getRawValue();
      pd['date'] = this.toDateOnly(new Date(pd['admissionDate']));
      pd['DOB'] = this.toDateOnly(new Date(pd['dob']));
      pd['programDetailId'] = this.selected.detail.id;
      let formData = new FormData();
      let data = this.uploader['queue'][0].file;
      formData.append('files', data.rawFile, data.name);
      formData.append('type', data.rawFile['type']);
      this.loaders.box = true;

      alert('test bf call');
      this.createStudentRecord(pd).then((res) => {
        alert('data done');

        if (res['studentId']) {
          formData.append('parent', 'student');
          formData.append('parentId', res['studentId']);
          this.StudentData.post(
            'studentForm/upload/' + res['studentId'],
            formData
          ).subscribe((res) => {});
        } else {
          console.log('studentId not found');
        }
      });
    }
  }

  private createStudentRecord(pd) {
    return new Promise((resolve, reject) => {
      if (this.id) {
        this.StudentData.put('studentForm/update/' + this.id, pd).subscribe(
          (res) => {}
        );
      } else {
        this.StudentData.post('studentForm/create', pd).subscribe(
          (res) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          }
        );
      }
    });
  }


  public toDateOnly(date) {
    if (typeof date === 'string') {
      date = date.replace('Z', '');
    }

    if (typeof date === 'string' && date.split('T').length === 1) {
      date = date + 'T00:00:00';
    }
    date = new Date(date);
    const year = date.getFullYear();

    const month = date.getMonth() + 1;
    const monthStr = month > 9 ? month : '0' + month;

    const dayOfMonth = date.getDate();
    const dayStr = dayOfMonth > 9 ? dayOfMonth : '0' + dayOfMonth;

    return `${year}-${monthStr}-${dayStr}`;
  }
}
