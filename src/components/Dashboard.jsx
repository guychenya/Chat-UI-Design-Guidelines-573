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
  FiAlertCircle, FiToggleRight, FiToggleLeft, FiGrip
} = FiIcons;

// Progress Ring Component
const ProgressRing = ({ value, color, label, icon, size = 120 }) => {
  const strokeWidth = size / 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (100 - value) / 100 * circumference;

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="progress-ring-background"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity="0.2"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-progress"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        />
      </svg>
      <div className="progress-ring-content" style={{ fontSize: size / 10 }}>
        {icon && <SafeIcon icon={icon} style={{ fontSize: size / 4 }} />}
        <span className="progress-ring-value">{value}%</span>
        <span className="progress-ring-label">{label}</span>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ value, max = 100, label, icon }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <div className="progress-bar-icon">
          <SafeIcon icon={icon} />
        </div>
        <div className="progress-bar-label">{label}</div>
        <div className="progress-bar-value">{value}%</div>
      </div>
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${value}%`, background: `linear-gradient(90deg, #3b82f6 0%, #8b5cf6 ${value}%)` }} 
        />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: color }}>
        <SafeIcon icon={icon} />
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, label }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="status-badge">
      <div className={`status-indicator ${getStatusColor()}`} />
      <div className="status-label">{label}</div>
    </div>
  );
};

const Dashboard = ({ inPanel = false }) => {
  const { theme } = useTheme();
  const { settings, updateModelParameter } = useSettings();
  const [semanticUncertainty, setSemanticUncertainty] = useState(68);
  const [boundaryThreshold, setBoundaryThreshold] = useState(settings.modelParameters.temperature * 100);
  const [logicalResonance, setLogicalResonance] = useState(82);
  const [temperature, setTemperature] = useState(settings.modelParameters.temperature);
  const [knowledgeBoundary, setKnowledgeBoundary] = useState(true);
  const [hallucinationDetection, setHallucinationDetection] = useState(true);
  const [memoryExport, setMemoryExport] = useState(false);
  const [bbcrEnabled, setBbcrEnabled] = useState(true);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [flowExpanded, setFlowExpanded] = useState(false);

  // Add state for card order
  const [cardOrder, setCardOrder] = useState(() => {
    const savedOrder = localStorage.getItem('dashboardCardOrder');
    return savedOrder ? JSON.parse(savedOrder) : [
      'semanticUncertainty',
      'logicalResonance',
      'temperatureControl',
      'resonanceFlow'
    ];
  });

  // Resonance Flow chart data
  const [resonanceFlowData, setResonanceFlowData] = useState([
    { name: 'Semantic', value: 78 },
    { name: 'Logical', value: 65 },
    { name: 'Creative', value: 82 },
    { name: 'Factual', value: 91 },
    { name: 'Contextual', value: 73 }
  ]);

  // Save card order to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardCardOrder', JSON.stringify(cardOrder));
  }, [cardOrder]);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSemanticUncertainty(Math.floor(60 + Math.random() * 20));
      setLogicalResonance(Math.floor(75 + Math.random() * 15));
      
      // Update flow data with small variations
      setResonanceFlowData(prev => prev.map(item => ({
        ...item,
        value: Math.max(50, Math.min(100, item.value + (Math.random() * 10 - 5)))
      })));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle temperature change
  const handleTemperatureChange = (value) => {
    setTemperature(value);
    updateModelParameter('temperature', value);
    setBoundaryThreshold(value * 100);
  };

  // Resonance Flow chart options with vibrant colors
  const getResonanceFlowOptions = () => {
    const colors = [
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#10b981', // Green
      '#f59e0b', // Amber
      '#ef4444'  // Red
    ];

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}%'
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
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: resonanceFlowData.map(item => item.name),
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: theme === 'dark' ? 'rgba(226,232,240,0.85)' : 'rgba(15,23,42,0.85)',
          fontSize: 12
        }
      },
      series: [
        {
          name: 'Resonance',
          type: 'bar',
          data: resonanceFlowData.map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: colors[index % colors.length],
              borderRadius: [0, 4, 4, 0]
            }
          })),
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%',
            color: theme === 'dark' ? 'rgba(226,232,240,0.85)' : 'rgba(15,23,42,0.85)'
          },
          barWidth: '60%'
        }
      ]
    };
  };

  const cardComponents = {
    semanticUncertainty: (
      <ProgressRing
        key="semanticUncertainty"
        value={semanticUncertainty}
        color="#3b82f6"
        label="Semantic Uncertainty"
        icon={FiActivity}
        size={inPanel ? 80 : 120}
      />
    ),
    logicalResonance: (
      <ProgressRing
        key="logicalResonance"
        value={logicalResonance}
        color="#10b981"
        label="Logical Resonance"
        icon={FiZap}
        size={inPanel ? 80 : 120}
      />
    ),
    temperatureControl: (
      <div key="temperatureControl" className="dashboard-kpi-group">
        <ProgressBar
          value={boundaryThreshold}
          label="Boundary Threshold"
          icon={FiMaximize2}
        />
        <div className="stat-card temperature-card">
          <div className="stat-card-icon" style={{ backgroundColor: "rgba(249,115,22,0.2)" }}>
            <SafeIcon icon={FiThermometer} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-label">Temperature</div>
            <div className="temperature-control">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                className="temperature-slider"
              />
              <div className="temperature-value">{temperature}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    resonanceFlow: (
      <div key="resonanceFlow" className="chart-container resonance-flow-chart">
        <h3 className="chart-title">Resonance Flow</h3>
        <ReactECharts
          option={getResonanceFlowOptions()}
          style={{ height: '180px', width: '100%' }}
          theme={theme === 'dark' ? 'dark' : undefined}
        />
      </div>
    )
  };

  const containerClass = inPanel ? `dashboard-in-panel ${theme}` : `dashboard ${theme}`;

  return (
    <div className={containerClass}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">Analytics Dashboard</h2>
        <p className="dashboard-subtitle">Real-time semantic metrics</p>
      </div>

      <Reorder.Group
        as="div"
        axis="y"
        values={cardOrder}
        onReorder={setCardOrder}
        className="dashboard-kpis"
      >
        {cardOrder.map((cardId) => (
          <Reorder.Item
            key={cardId}
            value={cardId}
            className="dashboard-kpi-item"
            dragListener={!inPanel}
          >
            <div className="dashboard-kpi-drag-handle">
              <SafeIcon icon={FiGrip} />
            </div>
            {cardComponents[cardId]}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="dashboard-toggles">
        <div className="toggle-group">
          <div className="toggle-item">
            <span className="toggle-label">Knowledge Boundary</span>
            <button 
              className={`toggle-button ${knowledgeBoundary ? 'active' : ''}`} 
              onClick={() => setKnowledgeBoundary(!knowledgeBoundary)}
            >
              <SafeIcon icon={knowledgeBoundary ? FiToggleRight : FiToggleLeft} />
            </button>
          </div>
          <div className="toggle-item">
            <span className="toggle-label">Hallucination Detection</span>
            <button 
              className={`toggle-button ${hallucinationDetection ? 'active' : ''}`} 
              onClick={() => setHallucinationDetection(!hallucinationDetection)}
            >
              <SafeIcon icon={hallucinationDetection ? FiToggleRight : FiToggleLeft} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;