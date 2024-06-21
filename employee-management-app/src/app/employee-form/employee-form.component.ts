import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: string | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.isEditMode = true;
        this.employeeService.getEmployee(this.employeeId).subscribe(employee => {
          this.employeeForm.patchValue(employee);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;
      if (this.isEditMode && this.employeeId) {
        this.employeeService.updateEmployee(this.employeeId, { ...employee, id: this.employeeId }).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.addEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      }
    }
  }
}
