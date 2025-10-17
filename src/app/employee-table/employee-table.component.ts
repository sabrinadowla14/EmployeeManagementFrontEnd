import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.css',
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  constructor(private service: EmployeeService, private router: Router) {}

  ngOnInit(): void {
    this.service.getEmployees().subscribe((employees: Employee[]) => {
      this.employees = employees;
      console.log('Employees', this.employees);
    });
  }

  deleteEmployee(id: number): void {
    this.service.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter((emp) => emp.id !== id);
        console.log(`Employee with id ${id} deleted successfully.`);
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
      },
    });
  }

  editEmployee(id: number) {
    this.router.navigate(['/edit', id]);
  }
}
