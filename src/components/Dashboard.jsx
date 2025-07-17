import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import ReactECharts from 'echarts-for-react';
import './Dashboard.css';

const {
  FiShield,
  FiEye,
  FiShare2,
  FiThermometer,
  FiGitMerge,
  FiActivity,
  FiZap,
  FiMaximize2,
  FiMinimize2,
  FiCheckCircle,
  FiAlertCircle,
  FiToggleRight,
  FiToggleLeft,
} = FiIcons;

const ProgressRing = ({ value, maxValue = 100, size = 100, strokeWidth = 6, color, label, icon }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value / maxValue;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="progress-ring">
      <div className="progress-ring-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="progress-ring-circle-bg"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <motion.circle
            className="progress-ring-circle"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="progress-ring-icon">
          <SafeIcon icon={icon} />
        </div>
        <div className="progress-ring-value">{Math.round(value)}%</div>
      </div>
      <div className="progress-ring-label">{label}</div>
    </div>
  );
};

const ProgressBar = ({ value, maxValue = 100, label, icon }) => {
  const progress = (value / maxValue) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <div className="progress-bar-icon">
          <SafeIcon icon={icon} />
        </div>
        <div className="progress-bar-label">{label}</div>
        <div className="progress-bar-value">{Math.round(value)}%</div>
      </div>
      <div className="progress-bar-track">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: color }}>
        <SafeIcon icon={icon} />
      </div>
      <div className="stat-card-content">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">
          {value}
          <span className="stat-card-unit">{unit}</span>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ icon, label, active }) => {
  return (
    <div className={`status-badge ${active ? 'active' : 'inactive'}`}>
      <SafeIcon icon={icon} />
      <span className="status-badge-label">{label}</span>
      <span className="status-badge-indicator">
        <SafeIcon icon={active ? FiCheckCircle : FiAlertCircle} />
      </span>
    </div>
  );
};

const SemanticTree = () => {
  const { theme } = useTheme();
  
  const options = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        type: 'tree',
        data: [
          {
            name: 'Root Topic',
            children: [
              {
                name: 'Semantic Analysis',
                value: 85,
                children: [
                  { name: 'Contextual Understanding', value: 78 },
                  { name: 'Entity Recognition', value: 92 }
                ]
              },
              {
                name: 'Logical Flow',
                value: 73,
                children: [
                  { name: 'Argument Structure', value: 68 },
                  { name: 'Causal Relationships', value: 77 }
                ]
              },
              {
                name: 'Knowledge Boundaries',
                value: 62,
                children: [
                  { name: 'Known Facts', value: 89 },
                  { name: 'Uncertain Areas', value: 45 }
                ]
              }
            ]
          }
        ],
        left: '2%',
        right: '2%',
        top: '10%',
        bottom: '10%',
        symbol: 'emptyCircle',
        orient: 'vertical',
        expandAndCollapse: true,
        label: {
          position: 'top',
          rotate: 0,
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 10,
          color: theme === 'dark' ? '#e2e8f0' : '#1e293b'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        emphasis: {
          focus: 'descendant'
        },
        animationDurationUpdate: 750
      }
    ]
  };

  return (
    <div className="semantic-tree">
      <ReactECharts option={options} style={{ height: '250px', width: '100%' }} theme={theme === 'dark' ? 'dark' : ''} />
    </div>
  );
};

const ResonanceFlow = () => {
  const { theme } = useTheme();
  
  const options = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}'
    },
    series: [
      {
        type: 'sankey',
        data: [
          { name: 'Input Query' },
          { name: 'Semantic Analysis' },
          { name: 'Knowledge Retrieval' },
          { name: 'Logical Reasoning' },
          { name: 'Response Generation' },
          { name: 'Uncertainty Assessment' }
        ],
        links: [
          { source: 'Input Query', target: 'Semantic Analysis', value: 85 },
          { source: 'Semantic Analysis', target: 'Knowledge Retrieval', value: 78 },
          { source: 'Semantic Analysis', target: 'Logical Reasoning', value: 65 },
          { source: 'Knowledge Retrieval', target: 'Logical Reasoning', value: 72 },
          { source: 'Logical Reasoning', target: 'Response Generation', value: 68 },
          { source: 'Response Generation', target: 'Uncertainty Assessment', value: 58 }
        ],
        left: '2%',
        right: '2%',
        top: '10%',
        bottom: '10%',
        emphasis: {
          focus: 'adjacency'
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5
        },
        label: {
          color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
          fontSize: 10
        },
        itemStyle: {
          color: theme === 'dark' ? 
            ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'] : 
            ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#4f46e5']
        }
      }
    ]
  };

  return (
    <div className="resonance-flow">
      <ReactECharts option={options} style={{ height: '250px', width: '100%' }} theme={theme === 'dark' ? 'dark' : ''} />
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

  // Sync temperature with settings
  useEffect(() => {
    setTemperature(settings.modelParameters.temperature);
    setBoundaryThreshold(settings.modelParameters.temperature * 100);
  }, [settings.modelParameters.temperature]);

  // Handle temperature change in the dashboard
  const handleTemperatureChange = (newTemp) => {
    setTemperature(newTemp);
    updateModelParameter('temperature', newTemp);
  };

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSemanticUncertainty(prev => Math.max(50, Math.min(95, prev + (Math.random() * 8 - 4))));
      setLogicalResonance(prev => Math.max(65, Math.min(98, prev + (Math.random() * 6 - 3))));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const containerClass = inPanel ? `dashboard-in-panel ${theme}` : `dashboard ${theme}`;

  return (
    <div className={containerClass}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">Analytics Dashboard</h2>
        <p className="dashboard-subtitle">Real-time semantic metrics</p>
      </div>

      <div className="dashboard-kpis">
        <ProgressRing
          value={semanticUncertainty}
          color="#3b82f6"
          label="Semantic Uncertainty"
          icon={FiActivity}
          size={inPanel ? 80 : 120}
        />
        <ProgressRing
          value={logicalResonance}
          color="#10b981"
          label="Logical Resonance"
          icon={FiZap}
          size={inPanel ? 80 : 120}
        />
        <div className="dashboard-kpi-group">
          <ProgressBar
            value={boundaryThreshold}
            label="Boundary Threshold"
            icon={FiMaximize2}
          />
          <div className="stat-card temperature-card">
            <div className="stat-card-icon" style={{backgroundColor: "rgba(249, 115, 22, 0.2)"}}>
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
      </div>

      <div className="dashboard-status-bar">
        <StatusBadge icon={FiShield} label="Knowledge Boundary" active={knowledgeBoundary} />
        <StatusBadge icon={FiEye} label="Hallucination Detection" active={hallucinationDetection} />
        <StatusBadge icon={FiShare2} label="Memory Export" active={memoryExport} />
      </div>

      <div className="dashboard-panels">
        <div className={`dashboard-panel ${treeExpanded ? 'expanded' : ''}`}>
          <div className="dashboard-panel-header" onClick={() => setTreeExpanded(!treeExpanded)}>
            <div className="dashboard-panel-title">
              <SafeIcon icon={FiGitMerge} />
              <span>Semantic Tree</span>
            </div>
            <button className="dashboard-panel-toggle">
              <SafeIcon icon={treeExpanded ? FiMinimize2 : FiMaximize2} />
            </button>
          </div>
          {treeExpanded && (
            <div className="dashboard-panel-content">
              <SemanticTree />
            </div>
          )}
        </div>

        <div className={`dashboard-panel ${flowExpanded ? 'expanded' : ''}`}>
          <div className="dashboard-panel-header" onClick={() => setFlowExpanded(!flowExpanded)}>
            <div className="dashboard-panel-title">
              <SafeIcon icon={FiActivity} />
              <span>Resonance Flow</span>
            </div>
            <button className="dashboard-panel-toggle">
              <SafeIcon icon={flowExpanded ? FiMinimize2 : FiMaximize2} />
            </button>
          </div>
          {flowExpanded && (
            <div className="dashboard-panel-content">
              <ResonanceFlow />
            </div>
          )}
        </div>

        <div className="dashboard-panel bbcr-panel">
          <div className="dashboard-panel-header">
            <div className="dashboard-panel-title">
              <SafeIcon icon={FiShield} />
              <span>BBCR Protocol</span>
            </div>
            <button
              className={`bbcr-toggle ${bbcrEnabled ? 'active' : ''}`}
              onClick={() => setBbcrEnabled(!bbcrEnabled)}
            >
              <SafeIcon icon={bbcrEnabled ? FiToggleRight : FiToggleLeft} />
              <span>{bbcrEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
          <div className="bbcr-status">
            <div className={`bbcr-indicator ${bbcrEnabled ? 'active' : 'inactive'}`}></div>
            <span>Status: {bbcrEnabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;