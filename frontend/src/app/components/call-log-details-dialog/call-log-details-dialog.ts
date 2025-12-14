import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiResInterfaces } from '../../interfaces'; 

@Component({
  selector: 'app-call-log-details-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './call-log-details-dialog.html',
  styleUrls: ['./call-log-details-dialog.css']
})
export class CallLogDetailsDialogComponent implements OnInit {
  
  @Input() callLog: ApiResInterfaces.CallLog | null = null;
  
  @Output() close = new EventEmitter<void>();

  activeTab: 'metaData' | 'callReport' | 'transcript' = 'metaData';

  public callReport: ApiResInterfaces.CallReport | null = null;
  public transcript: ApiResInterfaces.TranscriptEntry[] | null = null;

  ngOnInit(): void {
    if (this.callLog) {
      this.callReport = this.callLog.call_report || null;
      this.transcript = this.callLog.transcript || null;
    }
  }

  setActiveTab(tab: 'metaData' | 'callReport' | 'transcript'): void {
    this.activeTab = tab;
  }

  get filteredTranscript(): ApiResInterfaces.TranscriptEntry[] {
    if (!this.transcript) {
      return [];
    }
    return this.transcript.filter((e) => e.role !== 'system');
  }

  formatTime(absoluteMs: number): string {
    if (absoluteMs === undefined || absoluteMs === null) {
      return 'N/A';
    }

    const date = new Date(absoluteMs);

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  }

  getDurationSeconds(endTime: number | undefined, startTime: number | undefined): string {
    if (endTime === undefined || startTime === undefined || endTime === null || startTime === null) {
      return 'N/A';
    }
    const durationMs = endTime - startTime;
    return (durationMs / 1000).toFixed(2);
  }
}