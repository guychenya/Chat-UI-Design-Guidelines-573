import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useTheme } from '../contexts/ThemeContext';
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

const ProgressRing = ({ value, maxValue = 100, size = 120, strokeWidth = 8, color, label, icon }) => {
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
          fontSize: 12
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
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

const ResonanceFlow = () => {
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
        }
      }
    ]
  };

  return (
    <div className="resonance-flow">
      <ReactECharts option={options} style={{ height: '300px', width: '100%' }} />
    </div>
  );
};

const Dashboard = () => {
  const { theme } = useTheme();
  const [semanticUncertainty, setSemanticUncertainty] = useState(68);
  const [boundaryThreshold, setBoundaryThreshold] = useState(75);
  const [logicalResonance, setLogicalResonance] = useState(82);
  const [temperature, setTemperature] = useState(0.7);
  
  const [knowledgeBoundary, setKnowledgeBoundary] = useState(true);
  const [hallucinationDetection, setHallucinationDetection] = useState(true);
  const [memoryExport, setMemoryExport] = useState(false);
  
  const [bbcrEnabled, setBbcrEnabled] = useState(true);
  const [treeExpanded, setTreeExpanded] = useState(false);
  const [flowExpanded, setFlowExpanded] = useState(false);

  // Simulate changing metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setSemanticUncertainty(prev => Math.max(50, Math.min(95, prev + (Math.random() * 8 - 4))));
      setBoundaryThreshold(prev => Math.max(60, Math.min(90, prev + (Math.random() * 6 - 3))));
      setLogicalResonance(prev => Math.max(65, Math.min(98, prev + (Math.random() * 6 - 3))));
      setTemperature(prev => Math.max(0.1, Math.min(1.0, prev + (Math.random() * 0.2 - 0.1))).toFixed(2));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">Semantic Analysis Dashboard</h2>
        <p className="dashboard-subtitle">Real-time semantic metrics and analysis visualization</p>
      </div>
      
      <div className="dashboard-kpis">
        <ProgressRing 
          value={semanticUncertainty} 
          color="#3b82f6" 
          label="Semantic Uncertainty (Delta S)" 
          icon={FiActivity}
        />
        
        <ProgressRing 
          value={logicalResonance} 
          color="#10b981" 
          label="Logical Resonance (E Resonance)" 
          icon={FiZap}
        />
        
        <div className="dashboard-kpi-group">
          <ProgressBar 
            value={boundaryThreshold} 
            label="Boundary Threshold (Lambda Observe)" 
            icon={FiMaximize2}
          />
          
          <StatCard 
            icon={FiThermometer} 
            label="Temperature" 
            value={temperature} 
            color="rgba(249, 115, 22, 0.2)" 
            unit=""
          />
        </div>
      </div>
      
      <div className="dashboard-status-bar">
        <StatusBadge 
          icon={FiShield} 
          label="Knowledge Boundary" 
          active={knowledgeBoundary} 
        />
        <StatusBadge 
          icon={FiEye} 
          label="Hallucination Detection" 
          active={hallucinationDetection} 
        />
        <StatusBadge 
          icon={FiShare2} 
          label="Memory Export" 
          active={memoryExport} 
        />
      </div>
      
      <div className="dashboard-panels">
        <div className={`dashboard-panel ${treeExpanded ? 'expanded' : ''}`}>
          <div className="dashboard-panel-header" onClick={() => setTreeExpanded(!treeExpanded)}>
            <div className="dashboard-panel-title">
              <SafeIcon icon={FiGitMerge} />
              <span>Semantic Tree Navigation</span>
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
              <span>Resonance Amplification</span>
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
              <span>Boundary-Based Coherence Resolution (BBCR)</span>
            </div>
            <button 
              className={`bbcr-toggle ${bbcrEnabled ? 'active' : ''}`}
              onClick={() => setBbcrEnabled(!bbcrEnabled)}
            >
              <SafeIcon icon={bbcrEnabled ? FiToggleRight : FiToggleLeft} />
              <span>{bbcrEnabled ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
          <div className="bbcr-status">
            <div className={`bbcr-indicator ${bbcrEnabled ? 'active' : 'inactive'}`}></div>
            <span>Protocol Status: {bbcrEnabled ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;