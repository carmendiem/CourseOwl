import React from 'react';
import { ForumSearch } from '../components/ForumSearch/ForumSearch.js';
import { ThemeProvider } from '@mui/material/styles';
import forumTheme from '../components/ForumSearch/ForumTheme.js';

function Forums() {
    return (
        <div>
            <ThemeProvider theme={forumTheme}>
                <ForumSearch />
            </ThemeProvider>
        </div>
    );
}

export default Forums;
