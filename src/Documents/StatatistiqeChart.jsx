import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const StatisticsChart = ({ statistiques }) => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    const destroyCharts = () => {
      [barChartInstance.current, pieChartInstance.current].forEach(chart => {
        chart && chart.destroy();
      });
    };

    destroyCharts();

    if (statistiques && barChartRef.current && pieChartRef.current) {
      const chartData = {
        labels: ['Patients', 'Rendez-vous', 'Médecins', 'Secrétaires'],
        datasets: [{
          data: [
            statistiques.totalPatients || 0,
            statistiques.totalRendezvous || 0,
            statistiques.totalMedecins || 0,
            statistiques.totalSecretaires || 0,
          ],
          backgroundColor: [
            'rgba(102, 178, 255, 0.6)',
            'rgba(153, 204, 255, 0.6)',
            'rgba(204, 153, 255, 0.6)',
            'rgba(153, 255, 255, 0.6)'
          ],
          borderColor: [
            'rgba(102, 178, 255, 1)',
            'rgba(153, 204, 255, 1)',
            'rgba(204, 153, 255, 1)',
            'rgba(153, 255, 255, 1)'
          ],
          borderWidth: 1
        }]
      };

      // Bar Chart
      barChartInstance.current = new Chart(barChartRef.current, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });

      // Pie Chart
      pieChartInstance.current = new Chart(pieChartRef.current, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'right' } }
        }
      });
    }

    return destroyCharts;
  }, [statistiques]);

  return (
    <div className="row mt-4">
      <div className="col-md-12">
        <h4>Statistiques globales</h4>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Répartition par catégorie (Barres)</h5>
                <div style={{ height: '400px' }}>
                  <canvas ref={barChartRef} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Répartition proportionnelle (Circulaire)</h5>
                <div style={{ height: '400px' }}>
                  <canvas ref={pieChartRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;