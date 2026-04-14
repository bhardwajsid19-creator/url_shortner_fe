// ─── Single source of truth for all theme colors ───────────────────────────
// To change a color: update it here — CSS vars, Tailwind, and Ant Design
// all read from this file.

export const themes = {
  user: {
    cssVars: {
      '--color-primary':   '#F97316',
      '--color-secondary': '#FFF7ED',
      '--color-accent':    '#FBBF24',
      '--color-bg':        '#FFFFFF',
      '--color-text':      '#1C1917',
      '--color-success':   '#22C55E',
      '--color-warning':   '#EAB308',
      '--color-error':     '#EF4444',
      '--color-border':    '#FED7AA',
      '--color-muted':     '#A8A29E',
    },
    antd: {
      token: {
        colorPrimary:     '#F97316',
        colorSuccess:     '#22C55E',
        colorWarning:     '#EAB308',
        colorError:       '#EF4444',
        colorInfo:        '#FB923C',
        colorBgContainer: '#FFFFFF',
        colorBgLayout:    '#FFF7ED',
        colorText:        '#1C1917',
        colorBorder:      '#FED7AA',
        borderRadius:     8,
      },
    },
  },

  admin: {
    cssVars: {
      '--color-primary':   '#EA580C',
      '--color-secondary': '#FEF3C7',
      '--color-accent':    '#F59E0B',
      '--color-bg':        '#FFFFFF',
      '--color-text':      '#1C1917',
      '--color-success':   '#22C55E',
      '--color-warning':   '#F59E0B',
      '--color-error':     '#EF4444',
      '--color-border':    '#FDE68A',
      '--color-muted':     '#78716C',
    },
    antd: {
      token: {
        colorPrimary:     '#EA580C',
        colorSuccess:     '#22C55E',
        colorWarning:     '#F59E0B',
        colorError:       '#EF4444',
        colorInfo:        '#F97316',
        colorBgContainer: '#FFFFFF',
        colorBgLayout:    '#FEF3C7',
        colorText:        '#1C1917',
        colorBorder:      '#FDE68A',
        borderRadius:     6,
      },
    },
  },
}
