// Example of how to integrate Spotify Design System
import { 
  ThemeProvider, 
  Stack, 
  Typography, 
  Button, 
  Card, 
  Icon
} from 'spotify-design-system'
import { faPlay, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function DesignSystemExample() {
  return (
    <ThemeProvider>
      <Stack direction="column" spacing="lg">
        <Typography variant="heading">Design System Integration</Typography>
        
        <Stack direction="row" spacing="md">
          <Button>
            <Icon icon={faPlay} />
            Play
          </Button>
          <Button>
            <Icon icon={faHeart} />
            Like
          </Button>
          <Button>
            <Icon icon={faPlus} />
            Add
          </Button>
        </Stack>

        <Card title="Example Card">
          <Stack direction="column" spacing="md">
            <Typography variant="body">
              This shows how your design system components work together
            </Typography>
            <Typography variant="body" color="muted">
              All components are properly themed and styled
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </ThemeProvider>
  )
}
