import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import ReactECharts from 'echarts-for-react';
import './Dashboard.css';

const {
  FiShield, FiEye, FiShare2, FiThermometer, FiGitMerge,
  FiActivity, FiZap, FiMaximize2, FiMinimize2, FiCheckCircle,
  FiAlertCircle, FiToggleRight, FiToggleLeft, FiGrip,
  FiInfo, FiHelpCircle
} = FiIcons;

// ... (previous component definitions remain the same) ...

const Dashboard = ({ inPanel = false }) => {
  const { theme } = useTheme();
  const { settings, updateModelParameter } = useSettings();
  const [semanticUncertainty, setSemanticUncertainty] = useState(68);
  const [boundaryThreshold, setBoundaryThreshold] = useState(settings.modelParameters.temperature * 100);
  const [logicalResonance, setLogicalResonance] = useState(82);
  const [temperature, setTemperature] = useState(settings.modelParameters.temperature);
  
  // Add the missing handleTemperatureChange function
  const handleTemperatureChange = (value) => {
    setTemperature(value);
    updateModelParameter('temperature', value);
    setBoundaryThreshold(value * 100);
  };

  // Resonance Flow chart data with enhanced colors and accessibility
  const [resonanceFlowData, setResonanceFlowData] = useState([
    { name: 'Semantic', value: 78, color: '#3b82f6', icon: FiActivity },
    { name: 'Logical', value: 65, color: '#10b981', icon: FiGitMerge },
    { name: 'Creative', value: 82, color: '#8b5cf6', icon: FiZap },
    { name: 'Factual', value: 91, color: '#f59e0b', icon: FiCheckCircle },
    { name: 'Contextual', value: 73, color: '#ec4899', icon: FiShare2 }
  ]);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSemanticUncertainty(Math.floor(60 + Math.random() * 20));
      setLogicalResonance(Math.floor(75 + Math.random() * 15));
      
      setResonanceFlowData(prev => prev.map(item => ({
        ...item,
        value: Math.max(50, Math.min(100, item.value + (Math.random() * 10 - 5)))
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Enhanced chart options with accessibility features
  const getResonanceFlowOptions = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const data = params[0];
          return `${data.name}: ${data.value}%`;
        },
        textStyle: {
          fontSize: 14,
          fontWeight: 500
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: resonanceFlowData.map(item => item.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
          fontSize: 14,
          fontWeight: 500,
          margin: 16
        }
      },
      series: [{
        name: 'Resonance',
        type: 'bar',
        data: resonanceFlowData.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [0, 4, 4, 0]
          }
        })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          fontSize: 14,
          fontWeight: 500,
          color: theme === 'dark' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
        },
        barWidth: '60%'
      }]
    };
  };

  // Enhanced temperature control with better accessibility
  const TemperatureControl = () => (
    <div className="temperature-control-container">
      <div className="temperature-header">
        <SafeIcon icon={FiThermometer} className="temperature-icon" />
        <span className="temperature-label">Temperature</span>
        <Tooltip content="Controls the randomness of the model's outputs. Higher values make the output more creative but less focused." />
      </div>
      <div className="temperature-slider-container">
        <span className="temperature-min">0</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
          className="temperature-slider"
          aria-label="Temperature control"
        />
        <span className="temperature-max">1</span>
        <div className="temperature-value">{temperature}</div>
      </div>
    </div>
  );

  return (
    <div className={`dashboard ${theme} ${inPanel ? 'in-panel' : ''}`}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">Analytics Dashboard</h2>
        <p className="dashboard-subtitle">Real-time semantic metrics</p>
      </header>

      <div className="metrics-grid">
        <section className="metrics-section">
          <h3 className="section-title">Key Metrics</h3>
          <div className="metrics-row">
            <ProgressRing
              value={semanticUncertainty}
              color="#3b82f6"
              label="Semantic Uncertainty"
              icon={FiActivity}
              size={inPanel ? 120 : 160}
              description="Measures the model's confidence in understanding semantic context"
            />
            <ProgressRing
              value={logicalResonance}
              color="#10b981"
              label="Logical Resonance"
              icon={FiZap}
              size={inPanel ? 120 : 160}
              description="Indicates the coherence and logical flow of responses"
            />
          </div>
        </section>

        <section className="metrics-section">
          <h3 className="section-title">Model Controls</h3>
          <TemperatureControl />
          <ProgressBar
            value={boundaryThreshold}
            label="Boundary Threshold"
            icon={FiMaximize2}
            description="Defines the model's operational limits for maintaining response quality"
          />
        </section>

        <section className="metrics-section">
          <h3 className="section-title">Resonance Analysis</h3>
          <div className="resonance-flow-container">
            <ReactECharts
              option={getResonanceFlowOptions()}
              style={{ height: '240px', width: '100%' }}
              theme={theme === 'dark' ? 'dark' : undefined}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;