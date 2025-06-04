export const exportToJSON = (data, filename = 'github_analysis') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    return false;
  }
};

export const exportToCSV = (data, filename = 'github_analysis') => {
  try {
    let csvContent = '';
    
    if (Array.isArray(data)) {
      // Handle array of objects
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        csvContent = headers.join(',') + '\n';
        
        data.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          });
          csvContent += values.join(',') + '\n';
        });
      }
    } else {
      // Handle single object - convert to key-value pairs
      csvContent = 'Property,Value\n';
      Object.entries(data).forEach(([key, value]) => {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : value;
        csvContent += `${key},"${formattedValue}"\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
};

export const prepareRepoDataForExport = (repoData, additionalData = {}) => {
  const exportData = {
    repository: {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      url: repoData.html_url,
      owner: repoData.owner?.login,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      size: repoData.size,
      language: repoData.language,
      languages_url: repoData.languages_url,
      stargazers_count: repoData.stargazers_count,
      watchers_count: repoData.watchers_count,
      forks_count: repoData.forks_count,
      open_issues_count: repoData.open_issues_count,
      default_branch: repoData.default_branch,
      topics: repoData.topics,
      license: repoData.license?.name,
      is_private: repoData.private,
      is_fork: repoData.fork,
      has_wiki: repoData.has_wiki,
      has_pages: repoData.has_pages,
      has_issues: repoData.has_issues,
      has_projects: repoData.has_projects,
      archived: repoData.archived,
      disabled: repoData.disabled
    },
    analysis_metadata: {
      analyzed_at: new Date().toISOString(),
      analyzer_version: '1.0.0'
    },
    ...additionalData
  };
  
  return exportData;
};

export const prepareContributorsForExport = (contributors) => {
  return contributors.map(contributor => ({
    login: contributor.login,
    id: contributor.id,
    type: contributor.type,
    contributions: contributor.contributions,
    avatar_url: contributor.avatar_url,
    html_url: contributor.html_url,
    site_admin: contributor.site_admin
  }));
};

export const prepareLanguagesForExport = (languages) => {
  const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  return Object.entries(languages).map(([language, bytes]) => ({
    language,
    bytes,
    percentage: ((bytes / total) * 100).toFixed(2)
  }));
};

export const prepareCommitActivityForExport = (activity) => {
  return activity.map(week => ({
    week_timestamp: week.week,
    week_date: new Date(week.week * 1000).toISOString().split('T')[0],
    total_commits: week.total,
    daily_commits: week.days
  }));
};

const exportUtils = {
  exportToJSON,
  exportToCSV,
  prepareRepoDataForExport,
  prepareContributorsForExport,
  prepareLanguagesForExport,
  prepareCommitActivityForExport
};

export default exportUtils;