import React, { useState } from 'react';
import './App.css';

const notes = ['C', 'C# / D♭', 'D', 'D# / E♭', 'E', 'F', 'F# / G♭', 'G', 'G# / A♭', 'A', 'A# / B♭', 'B'];

const chordIntervals: { [key: string]: number[] } = {
  'Major Triad': [4, 7],
  'Minor Triad': [3, 7],
  'Augmented Triad': [4, 8],
  'Diminished Triad': [3, 6],
  'Major 7th': [4, 7, 11],
  'Dominant 7th': [4, 7, 10],
  'Minor 7th': [3, 7, 10],
  'Half-Diminished 7th': [3, 6, 10]
};

const getNoteByInterval = (startNote: string, interval: number): string => {
  const startIndex = notes.indexOf(startNote);
  const endIndex = (startIndex + interval) % notes.length;
  return notes[endIndex];
};

const createChords = (rootNote: string) => {
  const chordsForNote: { [key: string]: string[] } = {};
  for (const chordType in chordIntervals) {
    const intervals = chordIntervals[chordType];
    const chord = [rootNote];
    intervals.forEach(interval => {
      chord.push(getNoteByInterval(rootNote, interval));
    });
    chordsForNote[chordType] = chord;
  }
  return chordsForNote;
};

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<string>(notes[0]);
  const [chords, setChords] = useState<{ [key: string]: string[] } | null>(createChords(notes[0]));

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRootNote = event.target.value;
    setRootNote(newRootNote);
    setChords(createChords(newRootNote));
  };

  return (
    <div className="App">
      <h1>Chord Generator</h1>
      <div className="dropdown-container">
        <label className="dropdown-label">
          Select Root Note: &nbsp;
          <select className="dropdown-select" value={rootNote} onChange={handleChange}>
            {notes.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </label>
      </div>
      {chords && (
        <div className="chords">
          <h2>Chords for {rootNote}</h2>
          <table>
            <thead>
              <tr>
                <th>Chord Type</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(chords).map(([chordType, chordNotes]) => (
                <tr key={chordType}>
                  <td>{chordType}</td>
                  <td>{chordNotes.join(' + ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
