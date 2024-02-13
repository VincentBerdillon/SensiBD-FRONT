import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import leafIcon from '../../assets/feuille.png';

// Contenu des 3 étapes du composant Stepper
const steps = [
  {
    label: '10 crédits de départ',
    description:
      'À votre inscription, vous avez reçu 10 crédit feuilles en cadeau ! Ces petites feuilles vous permettront de prendre et de donner de façon équilibrer sur cette plateforme. Ainsi, il ni a pas que des preneurs ou que des donneurs.',
  },
  {
    label: 'Contacter = -1 crédit',
    description:
      'À chaque entrée en contact avec un donneur, vous utilisez un crédit feuille. Ainsi, vous avez dès le début la possibilité de contacter 10 personnes, formidable non ?',
  },
  {
    label: 'Donner =  +2 crédit',
    description: `À chaque fois que vous postez une annonce de don, vous recevez 2 crédits feuilles. De quoi continuer de contacter et...de lire ! :)`,
  },
];

//* Composant Stepper

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box sx={{ maxWidth: 400, padding: '2rem' }}>
        <img
          src={leafIcon}
          className="header__topContainer-credit-logo"
          alt="Logo Leeaf"
          style={{
            margin: 'auto',
            minHeight: '0vh',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
        <Typography
          variant="h5"
          sx={{ marginTop: 2, textAlign: 'center', mb: '2rem' }}
        >
          Les Crédits :
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1, backgroundColor: '#95C23D' }}
                    >
                      {index === steps.length - 1 ? 'Finir' : 'Continuer'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Retour
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reprendre
          </Button>
        )}
      </Box>
    </div>
  );
}
