#!/usr/bin/env node

/**
 * Interactive Audio File Mapper
 * This script helps you map your existing Amharic audio files to the app structure
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Target structure for the app
const targetStructure = {
  alphabets: ['ha.mp3', 'la.mp3', 'ma.mp3', 'sa.mp3', 'ra.mp3'],
  greetings: ['hello.mp3', 'how_are_you.mp3', 'goodbye.mp3', 'good_morning.mp3'],
  numbers: ['one.mp3', 'two.mp3', 'three.mp3', 'four.mp3', 'five.mp3']
};

// Amharic text mapping for reference
const amharicMapping = {
  'alphabets/ha.mp3': 'ሀ (ha)',
  'alphabets/la.mp3': 'ለ (la)', 
  'alphabets/ma.mp3': 'መ (ma)',
  'greetings/hello.mp3': 'ሰላም (selam)',
  'greetings/how_are_you.mp3': 'እንዴት ናት? (indet nat?)',
  'greetings/goodbye.mp3': 'ደህና ሁን (dehna hun)',
  'numbers/one.mp3': 'አንድ (and)',
  'numbers/two.mp3': 'ሁለት (hulet)',
  'numbers/three.mp3': 'ሶስት (sost)'
};

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function mapAudioFiles() {
  console.log('🎵 Amharic Audio File Mapper for Lisan App');
  console.log('==========================================\n');
  
  const sourceFolder = await question('Enter the path to your Amharic audio files folder: ');
  
  if (!fs.existsSync(sourceFolder)) {
    console.log('❌ Folder not found. Please check the path.');
    rl.close();
    return;
  }
  
  const files = fs.readdirSync(sourceFolder).filter(f => 
    f.toLowerCase().endsWith('.mp3') || f.toLowerCase().endsWith('.wav')
  );
  
  if (files.length === 0) {
    console.log('❌ No audio files found in the folder.');
    rl.close();
    return;
  }
  
  console.log(`\n📁 Found ${files.length} audio files:`);
  files.forEach((file, i) => console.log(`${i + 1}. ${file}`));
  
  const mapping = {};
  const destFolder = path.join(__dirname, '..', 'assets', 'audio');
  
  console.log('\n🔤 Let\'s map your files to the app structure...\n');
  
  for (const [category, targetFiles] of Object.entries(targetStructure)) {
    console.log(`\n📂 Category: ${category.toUpperCase()}`);
    
    for (const targetFile of targetFiles) {
      const targetPath = `${category}/${targetFile}`;
      const amharicText = amharicMapping[targetPath] || '';
      
      console.log(`\n🎯 Target: ${targetFile} ${amharicText ? `(${amharicText})` : ''}`);
      console.log('Available files:');
      files.forEach((file, i) => {
        if (!Object.values(mapping).includes(file)) {
          console.log(`${i + 1}. ${file}`);
        }
      });
      
      const choice = await question('Enter file number (or "skip" to skip): ');
      
      if (choice.toLowerCase() !== 'skip') {
        const fileIndex = parseInt(choice) - 1;
        if (fileIndex >= 0 && fileIndex < files.length) {
          const selectedFile = files[fileIndex];
          if (!Object.values(mapping).includes(selectedFile)) {
            mapping[targetPath] = selectedFile;
            console.log(`✅ Mapped: ${selectedFile} → ${targetPath}`);
          } else {
            console.log('❌ File already mapped to another target.');
          }
        }
      }
    }
  }
  
  console.log('\n📋 Mapping Summary:');
  console.log('==================');
  Object.entries(mapping).forEach(([target, source]) => {
    console.log(`${source} → ${target}`);
  });
  
  const proceed = await question('\n❓ Copy files with this mapping? (y/n): ');
  
  if (proceed.toLowerCase() === 'y') {
    // Create directories
    Object.keys(targetStructure).forEach(category => {
      const categoryPath = path.join(destFolder, category);
      if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath, { recursive: true });
      }
    });
    
    // Copy files
    Object.entries(mapping).forEach(([target, source]) => {
      const sourcePath = path.join(sourceFolder, source);
      const destPath = path.join(destFolder, target);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied: ${source} → ${target}`);
      } catch (error) {
        console.log(`❌ Error copying ${source}: ${error.message}`);
      }
    });
    
    console.log('\n🎉 Files copied successfully!');
    console.log('\n🔧 Next steps:');
    console.log('1. Update the audioMap in app/services/AudioService.ts');
    console.log('2. Uncomment the require() statements');
    console.log('3. Test the audio playback in your app');
    
    generateAudioServiceCode(mapping);
  }
  
  rl.close();
}

function generateAudioServiceCode(mapping) {
  console.log('\n📝 AudioService.ts code to add:');
  console.log('================================');
  console.log('const audioMap: Record<string, any> = {');
  
  Object.keys(mapping).forEach(target => {
    const requirePath = `../../assets/audio/${target}`;
    console.log(`  '${target}': require('${requirePath}'),`);
  });
  
  console.log('};');
}

// Run the mapper
mapAudioFiles().catch(console.error);
