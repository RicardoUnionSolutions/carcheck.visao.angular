import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { CommonModule } from "@angular/common";

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie" | "doughnut";
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  legend?: boolean;
  tooltips?: boolean;
  scales?: any;
}

@Component({
  selector: "ck-chart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./ck-chart.component.html",
  styleUrls: ["./ck-chart.component.scss"],
})
export class CkChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() data: ChartData[] = [];
  @Input() type: "bar" | "line" | "pie" | "doughnut" = "bar";
  @Input() config: ChartConfig = { type: "bar" };
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() title: string = "";

  @ViewChild("chartCanvas", { static: false })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;

  ngOnInit() {
    this.initializeConfig();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] || changes["type"] || changes["config"]) {
      this.initializeConfig();
      if (this.ctx) {
        this.drawChart();
      }
    }
  }

  ngAfterViewInit() {
    if (this.chartCanvas) {
      this.ctx = this.chartCanvas.nativeElement.getContext("2d");
      this.drawChart();
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initializeConfig() {
    const defaultConfig: ChartConfig = {
      type: this.type,
      responsive: true,
      maintainAspectRatio: false,
      legend: true,
      tooltips: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    this.config = { ...defaultConfig, ...this.config };
  }

  private drawChart() {
    if (!this.ctx || !this.data.length) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = this.ctx;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = this.width;
    canvas.height = this.height;

    switch (this.config.type) {
      case "bar":
        this.drawBarChart(ctx, canvas);
        break;
      case "line":
        this.drawLineChart(ctx, canvas);
        break;
      case "pie":
      case "doughnut":
        this.drawPieChart(ctx, canvas);
        break;
    }
  }

  private drawBarChart(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    const barWidth = (chartWidth / this.data.length) * 0.8;
    const barSpacing = (chartWidth / this.data.length) * 0.2;

    const maxValue = Math.max(...this.data.map((d) => d.value));

    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = canvas.height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = item.color || this.getColor(index);
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, canvas.height - padding + 15);

      // Draw value
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
    });
  }

  private drawLineChart(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    const maxValue = Math.max(...this.data.map((d) => d.value));
    const minValue = Math.min(...this.data.map((d) => d.value));
    const valueRange = maxValue - minValue;

    ctx.strokeStyle = "#ecda26";
    ctx.lineWidth = 3;
    ctx.beginPath();

    this.data.forEach((item, index) => {
      const x = padding + (index / (this.data.length - 1)) * chartWidth;
      const y =
        padding +
        chartHeight -
        ((item.value - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw point
      ctx.fillStyle = item.color || this.getColor(index);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();
  }

  private drawPieChart(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 40;

    const total = this.data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    this.data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.fillStyle = item.color || this.getColor(index);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
      const labelY = centerY + Math.sin(labelAngle) * (radius + 20);

      ctx.fillStyle = "#333";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(item.label, labelX, labelY);

      currentAngle += sliceAngle;
    });

    // Draw center circle for doughnut
    if (this.config.type === "doughnut") {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  private getColor(index: number): string {
    const colors = [
      "#ecda26",
      "#244b5a",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
    ];
    return colors[index % colors.length];
  }
}
