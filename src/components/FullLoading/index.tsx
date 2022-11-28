import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Props {
  isLoading: boolean;
}

function FullLoading({ isLoading }: Props): JSX.Element {
  return (
    <div>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}>
          <CircularProgress />
        </Box>
      ) : null}
    </div>
  );
}

export default FullLoading;
