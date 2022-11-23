import React from 'react';
import { DivFlex, SecondaryLabel } from '..';

interface ActionProps {
  src?: string;
  label: React.ReactNode;
  onClick?: any;
}

export const ActionList = ({ actions }: { actions: ActionProps[] }) => (
  <>
    {actions.map((act) => (
      <DivFlex alignItems="center" style={{ cursor: 'pointer', padding: '5px 0px' }} onClick={act.onClick || null}>
        {act.src && <img src={act.src} style={{ marginRight: 13 }} />}
        <SecondaryLabel>{act.label}</SecondaryLabel>
      </DivFlex>
    ))}
  </>
);
