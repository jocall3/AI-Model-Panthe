import React from 'react';
import { ModelSelector, ModelUniverseProvider } from './components/ModelSelector';
import { MockModelService } from './services/modelService';

const App: React.FC = () => {
  return (
    <ModelUniverseProvider service={MockModelService}>
        <ModelSelector />
    </ModelUniverseProvider>
  );
};

export default App;
