import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input() user!: { firstName: string; lastName: string; registrationDate: string };
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
