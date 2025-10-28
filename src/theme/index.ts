import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { previaColors } from './colors'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const previaTheme = extendTheme({
  config,
  colors: {
    previa: previaColors,
    // Semantic mappings
    brand: {
      50: '#F9F4EB',
      100: '#F2E9D8',
      200: '#E8D9C0',
      300: '#DEC9A8',
      400: '#D4B990',
      500: '#403B31', // Primary brand color (charcoal)
      600: '#332F27',
      700: '#26231D',
      800: '#1A1713',
      900: '#0D0B09',
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'JetBrains Mono, "SF Mono", Monaco, "Cascadia Code", monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'previa.cream',
        color: 'previa.charcoal',
        fontFamily: 'body',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'previa.charcoal',
          color: 'white',
          _hover: {
            bg: 'previa.darkStone',
          },
        },
        outline: {
          borderColor: 'previa.stone',
          color: 'previa.charcoal',
          _hover: {
            bg: 'previa.sand',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'previa.paperWhite',
          borderColor: 'previa.stone',
          borderWidth: '1px',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderColor: 'previa.stone',
          _focus: {
            borderColor: 'previa.sand',
            boxShadow: '0 0 0 1px var(--chakra-colors-previa-sand)',
          },
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          py: 2,
          borderRadius: 'md',
          borderColor: 'previa.sand',
          bg: 'white',
          boxShadow: 'lg',
        },
        item: {
          py: 2,
          px: 4,
          _hover: {
            bg: 'previa.cream',
          },
          _focus: {
            bg: 'previa.cream',
          },
        },
        groupTitle: {
          px: 4,
          py: 2,
          fontSize: 'sm',
          fontWeight: 'semibold',
          color: 'previa.darkStone',
        },
        divider: {
          my: 2,
          borderColor: 'previa.sand',
        },
      },
    },
  },
})
