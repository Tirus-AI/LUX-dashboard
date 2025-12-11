import { Box, useMediaQuery, useTheme } from '@mui/material';
import WorkflowGradient from '/assets/WorkflowGradient1.svg';
import Search from '../../components/ui/Search';
import Workflows from './Workfows';

function ResponsiveImage({ src, ...rest }: any) {
    const theme = useTheme();
    const sm = useMediaQuery(theme.breakpoints.only('sm'));
    const md = useMediaQuery(theme.breakpoints.only('md'));
    const lg = useMediaQuery(theme.breakpoints.only('lg'));
    const xl = useMediaQuery(theme.breakpoints.only('xl'));
    const xxl = useMediaQuery('(min-width:1920px)');

    let selectedSrc = src?.xs;
    if (sm) selectedSrc = src?.sm ?? selectedSrc;
    if (md) selectedSrc = src?.md ?? selectedSrc;
    if (lg) selectedSrc = src?.lg ?? selectedSrc;
    if (xl) selectedSrc = src?.xl ?? selectedSrc;
    if (xxl) selectedSrc = src?.xxl ?? selectedSrc;

    return <Box component="img" src={selectedSrc} {...rest} />;
}

const WorkflowPage: React.FC = () => {
    return (
        <Box sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0, 
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            >
                <ResponsiveImage
                    src={{ xs: WorkflowGradient, sm: WorkflowGradient, md: WorkflowGradient, lg: WorkflowGradient, xl: WorkflowGradient, xxl: WorkflowGradient }}
                    alt=""
                    aria-hidden
                    sx={{
                        width: '100%',
                        position: "absolute",
                        height: 'auto',
                        objectFit: 'cover',
                        top: { xs: '4%', sm: '4%', md: '7%', lg: '10%' },
                        zIndex: 0,
                        filter: { xs: 'blur(50px)', sm: 'blur(80px)', md: 'blur(82px)', lg: 'blur(32px)', xl: 'blur(52px)', xxl: 'blur(120px)' },
                    }}
                />
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ my: { xs: 2, sm: 2, md: 7, lg: 3 } }}>
                    <Search />
                </Box>
                <Workflows />
            </Box>
        </Box>
    );
};

export default WorkflowPage;