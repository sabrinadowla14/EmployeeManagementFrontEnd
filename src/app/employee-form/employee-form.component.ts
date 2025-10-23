import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
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
      const idParam = params.get('id');
      if (!idParam) {
        this.isEdited = false;
        return;
      }

      const id = Number(idParam);
      if (Number.isNaN(id)) {
        this.errorMessage = 'Invalid employee id.';
        return;
      }
      this.isEdited = true; // Set the flag to true if we are editing
      console.log('Editing employee with id:', id);
      //we can convert it using Number(id) or +id
      this.empService.getEmployeeById(id).subscribe({
        next: (employee) => {
          this.employee = employee;
          this.errorMessage = ''; // clear any prior error
          console.log('Employee data:', this.employee);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = this.friendlyError(err, id); // <-- string now
          console.error('Error fetching employee:', err);
        },
      });
    });
  }

  onSubmit(): void {
    if (this.isEdited) {
      this.empService.editEmployee(this.employee).subscribe({
        next: (updated) => {
          console.log('Employee updated successfully:', updated);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = this.friendlyError(err);
          console.error('Update failed:', err);
        },
      });
    } else {
      // demo payload to satisfy [Required] on API
      const payload = {
        ...this.employee,
        firstName: this.employee.firstName || 'Sabrina',
        lastName: this.employee.lastName || 'Dowla',
        email: this.employee.email || 'sabrina@example.com',
        phone: this.employee.phone || '555-1212',
        position: this.employee.position || 'Developer',
      };

      this.empService.createEmployee(payload).subscribe({
        next: (created) => {
          console.log('Employee created successfully:', created);
          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = this.friendlyError(err);
          console.error('Create failed:', err);
        },
      });
    }
  }
  private friendlyError(err: any, id?: number): string {
    // HttpErrorResponse shape
    const status = err?.status;
    const body = err?.error;

    if (status === 404) return id ? `Employee ${id} not found.` : 'Not found.';
    if (status === 0) return 'Network error—cannot reach the server.';

    if (body && typeof body === 'object') {
      if (body.title) return body.title; // ProblemDetails.title
      if (body.errors) {
        const msgs = Object.values(body.errors).flat() as string[];
        if (msgs.length) return msgs.join(' ');
      }
    }

    if (typeof body === 'string') return body;
    return `Request failed (${status ?? 'unknown'}).`;
  }
}
