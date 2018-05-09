import { Component, OnInit } from '@angular/core';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { BADFAMILY } from 'dns';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {
  public lineChartData:Array<any> = [
    {data: [10,20,16,18,15,16,17,18,16,20], label: 'Working hours'},
    {data: [15,24,15,15,15,15,15,16,16,16], label: 'Resting hours'},
    {data: [12,10,1,0,0,16,,4,4,4,4,4,4], label: 'Problem hours'}
  ];
  private month=1;
  private day=1;
  daysInMonth (month, year):any[] {
    let d=new Date(year, month, 0).getDate();
    let arr=[];
    for (let index = 0; index < d; index++) {
      arr.push(index+1);
    }
    return arr;
  }
  setLInChartLabels(m,y){
    this.lineChartLabels= this.daysInMonth(m,y);
  }
  public lineChartLabels:Array<any> = this.daysInMonth((new Date()).getMonth()+1,(new Date()).getFullYear());
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [
    { // green
      backgroundColor: 'rgba(140, 247, 0, 0.253)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // blue
      backgroundColor: 'rgba(4, 83, 252, 0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  public randomize():void {
    let _lineChartData:Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }
}
