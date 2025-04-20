import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { RetirementDataService } from '../retirement-form.service';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for fetching the file
import { RetirementService } from '../retirement.service'; // Make sure this path is correct

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  retirementForm: FormGroup = new FormGroup({
    currentAge: new FormControl('18', [
      Validators.required,
      Validators.min(18),
      Validators.max(60),
    ]),
    currentSave: new FormControl('0', [
      Validators.required,
      Validators.min(0),
      Validators.max(100000),
    ]),
    monthlSave: new FormControl('0', [
      Validators.required,
      Validators.min(0),
      Validators.max(10000),
    ]),
    targetAge: new FormControl('18', [
      Validators.required,
      Validators.min(18),
      Validators.max(60),
    ]),
    targetSave: new FormControl('0', [
      Validators.required,
      Validators.min(0),
      Validators.max(1000000),
    ]),
  });

  constructor(
    private dataService: RetirementDataService,
    private retirementService: RetirementService,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit(): void {
    this.retirementForm.markAllAsTouched();

    // 🟡 Fetch mock data from assets folder and autofill the form
    this.http.get<any[]>('assets/mockdata.json').subscribe(
      (data) => {
        if (data && data.length > 0) {
          const firstEntry = data[0];

          this.retirementForm.patchValue({
            currentAge: firstEntry.current_age,
            currentSave: parseInt(firstEntry.current_savings.replace(/[^0-9]/g, '')),
            monthlSave: parseFloat(firstEntry.monthly_savings.replace(/[^0-9.]/g, '')),
            targetAge: firstEntry.retirement_age,
            targetSave: parseInt(firstEntry.retirement_amt.replace(/[^0-9]/g, '')),
          });
        }
      },
      (error) => {
        console.error('Error loading mock data:', error);
      }
    );

    // 💬 Update form data to service on change
    this.retirementForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((values) => {
        if (this.retirementForm.valid) {
          this.dataService.updateFormData(values);
        } else {
          this.dataService.updateFormData(null);
        }
      });
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.retirementForm.get(controlName);
    if (!control) return false;

    if (errorType === 'required') {
      return control.hasError('required');
    }

    return (control.touched || control.dirty) && control.hasError(errorType);
  }

  updateSlider(controlName: string, event: any): void {
    const sliders = {
      currentAge: 'currentAgeSlider',
      currentSave: 'currentSaveSlider',
      monthlSave: 'monthlSaveSlider',
      targetAge: 'targetAgeSlider',
      targetSave: 'targetSaveSlider',
    };

    const value = event.target.value;
    const slider = document.getElementById(
      sliders[controlName as keyof typeof sliders]
    ) as HTMLInputElement;
    if (slider) {
      slider.value = value;
    }
  }

  updateInput(controlName: string, event: any): void {
    const value = event.target.value;
    this.retirementForm.get(controlName)?.setValue(value);
    this.retirementForm.get(controlName)?.markAsTouched();
  }

  getErrorMessage(controlName: string): string {
    const control = this.retirementForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This is a required field';
    }

    if (controlName === 'currentAge' || controlName === 'targetAge') {
      if (control?.hasError('min')) {
        return 'Age should not be less than 18';
      }
      if (control?.hasError('max')) {
        return 'Age should not be more than 60';
      }
    }

    if (controlName === 'currentSave') {
      if (control?.hasError('min')) {
        return 'Savings should not be less than 0';
      }
      if (control?.hasError('max')) {
        return 'Savings should not exceed $100,000';
      }
    }

    if (controlName === 'monthlSave') {
      if (control?.hasError('min')) {
        return 'Monthly contribution should not be less than 0';
      }
      if (control?.hasError('max')) {
        return 'Monthly contribution should not exceed $10,000';
      }
    }

    if (controlName === 'targetSave') {
      if (control?.hasError('min')) {
        return 'Target savings should not be less than 0';
      }
      if (control?.hasError('max')) {
        return 'Target savings should not exceed $1,000,000';
      }
    }

    return '';
  }
}
