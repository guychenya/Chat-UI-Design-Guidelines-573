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

// ... existing ProgressRing, ProgressBar, StatCard, StatusBadge components ... 

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
      'temperatureControl'
    ];
  });

  // Save card order to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardCardOrder', JSON.stringify(cardOrder));
  }, [cardOrder]);

  // Add the missing temperature change handler
  const handleTemperatureChange = (value) => {
    setTemperature(value);
    updateModelParameter('temperature', value);
    setBoundaryThreshold(value * 100);
  };

  // ... existing useEffect hooks ...

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

      {/* ... rest of the dashboard components ... */}
    </div>
  );
};

export default Dashboard;