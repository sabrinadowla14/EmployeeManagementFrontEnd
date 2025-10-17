import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  errorMessage: string = '';
  isEdited: boolean = false;

  employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
  };

  constructor(
    private empService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      //this id is from the route and is a string or null
      const id = params.get('id');
      if (id) {
        this.isEdited = true; // Set the flag to true if we are editing
        console.log('Editing employee with id:', id);
        //we can convert it using Number(id) or +id
        this.empService.getEmployeeById(+id).subscribe({
          next: (employee) => {
            this.employee = employee;
            console.log('Employee data:', this.employee);
          },
          error: (err) => {
            this.errorMessage = err;
            console.error('Error fetching employee:', err);
          },
        });
      } else {
        this.isEdited = false; // Set the flag to false if we are creating
        console.log('Creating a new employee');
      }
    });
  }

  onSubmit(): void {
    const payload = {
      ...this.employee,
      id: Number(this.employee.id), // must match route id
      firstName: (this.employee.firstName || '').trim(),
      lastName: (this.employee.lastName || '').trim(),
      email: (this.employee.email || '').trim(),
      phone: String(this.employee.phone ?? '').trim(), // ensure string
      position: (this.employee.position || '').trim(),
    };
    if (this.isEdited) {
      // Update existing employee

      this.empService.editEmployee(this.employee).subscribe({
        next: (newEmployee) => {
          console.log('Employee created successfully:', newEmployee);
          this.router.navigate(['/']); // Navigate back to the employee list after creation
        },
        error: (err) => {
          this.errorMessage = err;
          console.error('Error creating employee:', err.status);
        },
      });
    } else {
      // Create new employee
      this.empService.createEmployee(this.employee).subscribe({
        next: (newEmployee) => {
          console.log('Employee created successfully:', newEmployee);
          this.router.navigate(['/']); // Navigate back to the employee list after creation
        },
        error: (err) => {
          this.errorMessage = err;
          console.error('Error creating employee:', err.status);
        },
      });
    }
  }
}
