import React, { useState, useEffect } from 'react';
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

const majorScaleIntervals = [2, 2, 1, 2, 2, 2, 1];
const minorScaleIntervals = [2, 1, 2, 2, 1, 2, 2];
const scaleDegrees = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];

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

const createScale = (rootNote: string, scaleIntervals: number[]) => {
  const scale = [rootNote];
  let currentNote = rootNote;
  scaleIntervals.forEach(interval => {
    currentNote = getNoteByInterval(currentNote, interval);
    scale.push(currentNote);
  });
  return scale;
};

const getRelativeMinorRoot = (rootNote: string): string => {
  return getNoteByInterval(rootNote, 9); // The 6th degree of the major scale is 9 semitones up from the root note
};

const App: React.FC = () => {
  const [rootNote, setRootNote] = useState<string>(notes[0]);
  const [chords, setChords] = useState<{ [key: string]: string[] } | null>(createChords(notes[0]));
  const [majorScale, setMajorScale] = useState<string[]>(createScale(notes[0], majorScaleIntervals));
  const [minorScale, setMinorScale] = useState<string[]>(createScale(notes[0], minorScaleIntervals));
  const [relativeMinorRoot, setRelativeMinorRoot] = useState<string>(getRelativeMinorRoot(notes[0]));
  const [relativeMinorScale, setRelativeMinorScale] = useState<string[]>(createScale(getRelativeMinorRoot(notes[0]), minorScaleIntervals));

  useEffect(() => {
    setChords(createChords(rootNote));
    setMajorScale(createScale(rootNote, majorScaleIntervals));
    setMinorScale(createScale(rootNote, minorScaleIntervals));
    const minorRoot = getRelativeMinorRoot(rootNote);
    setRelativeMinorRoot(minorRoot);
    setRelativeMinorScale(createScale(minorRoot, minorScaleIntervals));
  }, [rootNote]);

  const handleNoteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRootNote(event.target.value);
  };

  return (
    <div className="App">
      <h1>Chord Generator</h1>
      <div className="dropdown-container">
        <label className="dropdown-label">
          Select Root Note:
          <select className="dropdown-select" value={rootNote} onChange={handleNoteChange}>
            {notes.map(note => (
              <option key={note} value={note}>{note}</option>
            ))}
          </select>
        </label>
      </div>
      {majorScale && minorScale && relativeMinorScale && (
        <div className="scales">
          <div className="scale">
            <h2>Major Scale for {rootNote}</h2>
            <ul>
              {majorScale.map((note, index) => (
                <li key={index}>
                  <strong>{scaleDegrees[index]}:</strong> {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="scale">
            <h2>Minor Scale for {rootNote}</h2>
            <ul>
              {minorScale.map((note, index) => (
                <li key={index}>
                  <strong>{scaleDegrees[index]}:</strong> {note}
                </li>
              ))}
            </ul>
          </div>
          <div className="scale">
            <h2>Relative Minor Scale ({relativeMinorRoot})</h2>
            <ul>
              {relativeMinorScale.map((note, index) => (
                <li key={index}>
                  <strong>{scaleDegrees[index]}:</strong> {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
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
