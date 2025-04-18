-- Update parent_id values to create proper folder structure

-- Set the main root folders (first level)
UPDATE file_items SET parent_id = NULL WHERE name IN ('Documents', 'Images', 'Projects');

-- Update "Reports" and "Contracts" to be inside "Documents" folder
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Documents' LIMIT 1)
WHERE name IN ('Reports', 'Contracts');

-- Update "Product Photos" and "Team Photos" to be inside "Images" folder
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Images' LIMIT 1)
WHERE name IN ('Product Photos', 'Team Photos');

-- Update "Website Redesign" and "Mobile App" to be inside "Projects" folder
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Projects' LIMIT 1)
WHERE name IN ('Website Redesign', 'Mobile App');

-- Update document files to be inside their respective folders
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Documents' LIMIT 1)
WHERE name IN ('Business Plan.docx', 'Resume Template.docx', 'Tax Statement 2023.pdf');

-- Update reports related files
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Reports' LIMIT 1)
WHERE name IN ('Annual Report 2023.docx', 'Q4 Sales Analysis.xlsx', 'Marketing Performance.pdf');

-- Update contracts related files
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Contracts' LIMIT 1)
WHERE name IN ('Client Agreement.docx', 'NDA Template.pdf');

-- Update image files to be in the Images folder
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Images' LIMIT 1)
WHERE name = 'Logo Designs.png';

-- Update project files
UPDATE file_items SET parent_id = (SELECT id FROM file_items WHERE name = 'Projects' LIMIT 1)
WHERE name = 'Project Timeline.docx'; 