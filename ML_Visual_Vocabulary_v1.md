Visual Vocabulary for Common Machine‑Learning Nodes

The following visual vocabulary proposes academically familiar icons for common neural‑network operations. Each icon is accompanied by a conceptual sketch, example SVG markup, reference citations and a short rationale explaining how the design reflects the underlying mathematical operation. The designs are minimalist so that they scale down to small sizes (≈80×60 px) and preserve recognisability in monochrome.

1 Flatten
Conceptual sketch
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <!-- 3‑D tensor drawn as a stack of three coloured faces -->
  <g stroke="#333" stroke-width="2" fill="none">
    <polygon points="10,50 35,40 65,40 40,50" fill="#F5B700"/>
    <polygon points="10,65 35,55 35,40 10,50" fill="#F27970"/>
    <polygon points="35,55 65,55 65,40 35,40" fill="#5AB5E7"/>
  </g>
  <!-- arrow pointing to flattened vector -->
  <polyline points="75,50 95,50" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <!-- 1‑D vector represented as a bar of 4 cells -->
  <rect x="98" y="44" width="18" height="6" fill="#5AB5E7" stroke="#333"/>
  <rect x="116" y="44" width="18" height="6" fill="#F27970" stroke="#333"/>
  <!-- label -->
  <text x="5" y="15" font-size="10" fill="#333">Flatten</text>
</svg>
Reference

Convolutional‑network cheat sheets note that fully connected layers operate on a flattened 1‑D vector obtained by reshaping the convolutional feature map
stanford.edu
. The icon shows a 3‑D cube being unrolled into a single bar, matching textbook diagrams where the output of a convolution is “flattened” before the dense layer.

Rationale

In convolutional architectures, flattening converts a 3‑D feature map (height × width × channels) into a 1‑D vector. The stacked cube conveys the three spatial dimensions, while the horizontal bar on the right represents the vector fed into fully connected layers. The arrow communicates the transformation direction.

2 Embedding
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- sparse token indices drawn as circles -->
  <g fill="#ffffff" stroke="#333" stroke-width="2">
    <circle cx="10" cy="20" r="4"/>
    <circle cx="10" cy="35" r="4"/>
    <circle cx="10" cy="50" r="4"/>
  </g>
  <!-- arrow to embedding matrix -->
  <polyline points="18,35 40,35" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- embedding matrix represented as grid -->
  <g stroke="#333" stroke-width="1">
    <rect x="45" y="15" width="40" height="40" fill="#F5B700"/>
    <line x1="65" y1="15" x2="65" y2="55"/>
    <line x1="45" y1="35" x2="85" y2="35"/>
    <rect x="45" y="15" width="20" height="20" fill="#5AB5E7"/>
    <rect x="65" y="35" width="20" height="20" fill="#F27970"/>
  </g>
  <!-- arrow to dense vector -->
  <polyline points="87,35 115,35" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- dense embedding vector -->
  <rect x="118" y="30" width="18" height="10" fill="#5AB5E7" stroke="#333"/>
  <rect x="136" y="30" width="18" height="10" fill="#F27970" stroke="#333"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="2" y="72" font-size="8" fill="#333">Embedding</text>
</svg>
Reference

Embedding layers perform a lookup: a sparse token index is multiplied by an embedding matrix to produce a continuous vector
en.wikipedia.org
. Textbooks describe embeddings as trainable lookup tables where discrete tokens (one‑hot indices) map to dense vectors
radcollaboratory.rutgers.edu
. The icon depicts discrete token IDs feeding into a matrix grid and yielding a coloured vector.

Rationale

The left column of circles denotes sparse token IDs. The central grid represents the trainable embedding matrix—a lookup table whose rows correspond to tokens. The right bar is the dense vector retrieved from the matrix. Arrows emphasise the lookup process. Colour coding helps differentiate tokens, table rows and the resulting embedding.

3 Pooling
Conceptual sketch
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <!-- 2×2 input grid -->
  <rect x="10" y="25" width="20" height="20" fill="#BBD5EE" stroke="#333"/>
  <rect x="30" y="25" width="20" height="20" fill="#D4CBEA" stroke="#333"/>
  <rect x="10" y="45" width="20" height="20" fill="#DCEEF3" stroke="#333"/>
  <rect x="30" y="45" width="20" height="20" fill="#DECBE3" stroke="#333"/>
  <!-- arrow to pooled output -->
  <polyline points="55,45 75,45" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <!-- output cell -->
  <rect x="80" y="40" width="20" height="20" fill="#DECBE3" stroke="#333"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">Pooling</text>
</svg>
Reference

Pooling layers reduce the spatial resolution of feature maps while keeping the most salient information
arxiv.org
. Max‑pooling selects the maximum value from a small neighbourhood (e.g. 2×2 grid) and outputs a single value per window. This down‑sampling reduces the number of parameters and controls over‑fitting
arxiv.org
.

Rationale

The icon shows a 2×2 patch of the input feature map being consolidated into one cell. Different colours in the input grid hint at different values, and the arrow points to a single output square. In UI implementations one could vary the interior shading or annotate the selected cell for max vs average pooling.

4 Normalization
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- multiple distributions before normalisation -->
  <path d="M10,60 Q20,30 30,60" stroke="#74A3CE" fill="none" stroke-width="2"/>
  <path d="M20,60 Q30,35 40,60" stroke="#CEA8BF" fill="none" stroke-width="2"/>
  <path d="M30,60 Q40,40 50,60" stroke="#F5B478" fill="none" stroke-width="2"/>
  <!-- arrow to normalised distribution -->
  <polyline points="60,50 80,50" stroke="#333" stroke-width="3" marker-end="url(#arrow)"/>
  <!-- single standard distribution -->
  <path d="M90,60 Q100,25 110,60" stroke="#74A3CE" fill="none" stroke-width="2"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">Normalization</text>
</svg>
Reference

Batch Normalization normalises activations across the mini‑batch and spatial dimensions so that each channel has zero mean and unit variance
d2l.ai
. Layer Normalization instead normalises across the feature dimension of a single sample
d2l.ai
. Instance Normalization computes statistics per channel for each sample independently
docs.pytorch.org
. The icon conveys the idea of disparate distributions being mapped to a standard distribution.

Rationale

Multiple bell curves on the left symbolise the unnormalised distributions from different samples, channels or features. The single centred bell curve on the right depicts the target distribution after normalisation. This conveys that normalisation brings activations into a common scale, making training more stable.

5 Attention / Self‑Attention
Conceptual sketch
<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
  <!-- input tokens -->
  <rect x="20" y="20" width="20" height="12" rx="3" fill="#B8DDE4" stroke="#333"/>
  <text x="26" y="29" font-size="8" fill="#333">A</text>
  <rect x="60" y="20" width="20" height="12" rx="3" fill="#F5D398" stroke="#333"/>
  <text x="66" y="29" font-size="8" fill="#333">B</text>
  <rect x="100" y="20" width="20" height="12" rx="3" fill="#CBE0B5" stroke="#333"/>
  <text x="106" y="29" font-size="8" fill="#333">C</text>
  <!-- output tokens -->
  <rect x="20" y="70" width="20" height="12" rx="3" fill="#B8DDE4" stroke="#333"/>
  <text x="24" y="79" font-size="8" fill="#333">A′</text>
  <rect x="60" y="70" width="20" height="12" rx="3" fill="#F5D398" stroke="#333"/>
  <text x="64" y="79" font-size="8" fill="#333">B′</text>
  <rect x="100" y="70" width="20" height="12" rx="3" fill="#CBE0B5" stroke="#333"/>
  <text x="104" y="79" font-size="8" fill="#333">C′</text>
  <!-- connections (attention weights) -->
  <g stroke="#666" stroke-width="1">
    <line x1="30" y1="32" x2="30" y2="70"/>
    <line x1="30" y1="32" x2="70" y2="70"/>
    <line x1="30" y1="32" x2="110" y2="70"/>
    <line x1="70" y1="32" x2="30" y2="70"/>
    <line x1="70" y1="32" x2="70" y2="70"/>
    <line x1="70" y1="32" x2="110" y2="70"/>
    <line x1="110" y1="32" x2="30" y2="70"/>
    <line x1="110" y1="32" x2="70" y2="70"/>
    <line x1="110" y1="32" x2="110" y2="70"/>
  </g>
  <text x="5" y="15" font-size="10" fill="#333">Attention</text>
</svg>
<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
    <rect x="10" y="12" width="20" height="14" rx="3"/><rect x="45" y="12" width="20" height="14" rx="3"/><rect x="80" y="12" width="20" height="14" rx="3"/>
    <rect x="10" y="64" width="20" height="14" rx="3"/><rect x="45" y="64" width="20" height="14" rx="3"/><rect x="80" y="64" width="20" height="14" rx="3"/>
    <!-- connections -->
    <path d="M20 26 C20 44, 55 44, 55 64"/>
    <path d="M55 26 C55 44, 20 44, 20 64" opacity="0.6"/>
    <path d="M55 26 C55 44, 90 44, 90 64" opacity="0.6"/>
    <path d="M90 26 C90 44, 55 44, 55 64" opacity="0.3"/>
  </g>
  <title>Self‑Attention (bipartite)</title>
</svg>
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <g stroke="currentColor" stroke-width="2" fill="none">
    <rect x="10" y="20" width="20" height="40" rx="3"/><text x="20" y="45" font-size="10" text-anchor="middle">Q</text>
    <rect x="35" y="20" width="20" height="40" rx="3"/><text x="45" y="45" font-size="10" text-anchor="middle">K</text>
    <rect x="60" y="20" width="20" height="40" rx="3"/><text x="70" y="45" font-size="10" text-anchor="middle">V</text>
    <path d="M80 40 H100" /><rect x="100" y="33" width="10" height="14" rx="3"/>
  </g>
  <title>Scaled Dot‑Product Attention</title>
</svg>


Reference

The scaled dot‑product attention mechanism uses queries Q, keys K and values V. The attention score is computed as the dot product of the query and key vectors, scaled by the square root of the key dimension, passed through a softmax and used to weight the values
geeksforgeeks.org
. Multi‑head attention runs several attention functions in parallel and concatenates their outputs
geeksforgeeks.org
. The bipartite connections in the icon reflect that each output attends to all inputs, with different weights.

Rationale

The top row shows three input tokens (A, B, C); the bottom row shows corresponding output tokens (A′, B′, C′). Lines connecting every input to every output visualise the self‑attention mechanism: each output token is a weighted combination of all input tokens. In an implementation, line thickness or opacity could encode attention weights.

6 Recurrent Layers
6.1 Simple RNN
Conceptual sketch
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <!-- cell -->
  <rect x="40" y="30" width="30" height="20" rx="3" fill="#F5EEDC" stroke="#333"/>
  <!-- input arrow -->
  <polyline points="20,40 40,40" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- output arrow -->
  <polyline points="70,40 90,40" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- recurrent loop -->
  <path d="M60,30 C80,10 80,70 60,50" stroke="#333" fill="none" stroke-width="2" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">RNN</text>
</svg>
Reference

A simple recurrent neural network updates its hidden state by feeding the previous hidden state back into the next step. The state is updated using the current input and the previous hidden state, enabling sequence processing
colah.github.io
.

Rationale

The box represents the recurrent unit. The curved arrow looping from the output back into the box shows recurrence over time. Arrows entering from the left (input x_t) and exiting to the right (h_t) represent the flow of data through the sequence.

6.2 LSTM
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- cell state pathway -->
  <rect x="50" y="35" width="60" height="10" rx="5" fill="#FDE7D7" stroke="#333"/>
  <!-- gate circles -->
  <circle cx="30" cy="30" r="7" fill="#A7CEE7" stroke="#333"/>
  <text x="27" y="33" font-size="8" fill="#333">F</text>
  <circle cx="30" cy="45" r="7" fill="#B6DDBF" stroke="#333"/>
  <text x="26" y="48" font-size="8" fill="#333">I</text>
  <circle cx="30" cy="60" r="7" fill="#F8E5A0" stroke="#333"/>
  <text x="27" y="63" font-size="8" fill="#333">O</text>
  <!-- input to gates -->
  <polyline points="10,45 23,45" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- connection from input gate to cell -->
  <polyline points="37,45 50,40" stroke="#333" stroke-width="2"/>
  <!-- output arrow -->
  <polyline points="110,40 130,40" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">LSTM</text>
</svg>
Reference

In an LSTM cell the forget gate decides which information to retain, the input gate decides which new values to add, and the output gate decides what to output. The forget gate outputs numbers between 0 and 1 to determine how much of the previous cell state to keep
colah.github.io
. The input gate and candidate vector generate new state content
colah.github.io
, and the output gate uses the updated cell state to compute the hidden output
colah.github.io
.

Rationale

Three coloured circles labelled F, I and O represent the forget, input and output gates. The horizontal capsule depicts the cell state flowing through time. The input arrow feeds into the gates, and the output arrow carries the hidden state. The diagram highlights the gating mechanisms central to LSTM behaviour.

6.3 GRU
Conceptual sketch
<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <!-- update (U) and reset (R) gates -->
  <circle cx="30" cy="30" r="7" fill="#D4DDEE" stroke="#333"/>
  <text x="26" y="33" font-size="8" fill="#333">U</text>
  <circle cx="30" cy="50" r="7" fill="#E6DDE4" stroke="#333"/>
  <text x="26" y="53" font-size="8" fill="#333">R</text>
  <!-- input arrow to gates -->
  <polyline points="10,40 23,40" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <!-- hidden state -->
  <rect x="40" y="35" width="50" height="15" rx="3" fill="#F4EBD0" stroke="#333"/>
  <!-- output arrow -->
  <polyline points="90,42 110,42" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">GRU</text>
</svg>
Reference

Gated recurrent units combine the input and forget mechanisms into update and reset gates. These gates modulate how much of the previous hidden state to keep and how much new information to incorporate, simplifying the LSTM architecture while maintaining performance
colah.github.io
colah.github.io
.

Rationale

Two circles labelled U (update) and R (reset) represent the GRU’s gates. The rectangular block to the right depicts the hidden state. As with the LSTM and RNN icons, arrows show the flow of input and output information.

7 Dropout
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- row of neurons -->
  <g stroke="#333" stroke-width="2" font-size="8" fill="none">
    <circle cx="20" cy="40" r="7" fill="#F5E5A0"/>
    <circle cx="40" cy="40" r="7" fill="#AED2E6"/>
    <circle cx="60" cy="40" r="7" fill="#E0C9E6"/>
    <!-- crossed-out neuron -->
    <line x1="55" y1="35" x2="65" y2="45" stroke="#333"/>
    <line x1="65" y1="35" x2="55" y2="45" stroke="#333"/>
    <circle cx="80" cy="40" r="7" fill="#F9C6A6"/>
    <!-- another dropped neuron -->
    <line x1="75" y1="35" x2="85" y2="45" stroke="#333"/>
    <line x1="85" y1="35" x2="75" y2="45" stroke="#333"/>
    <circle cx="100" cy="40" r="7" fill="#F5E5A0"/>
    <circle cx="120" cy="40" r="7" fill="#AED2E6"/>
  </g>
  <!-- output arrow -->
  <polyline points="127,40 140,40" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">Dropout</text>
</svg>
Reference

Dropout randomly drops units and their connections during training to prevent co‑adaptation of feature detectors. Each unit is removed with probability p, resulting in a thinned network with only a fraction of the neurons active.

Rationale

The row of circles depicts neurons in a layer. Some circles are crossed out to indicate that they are “dropped” during training, matching the original dropout paper’s description. The arrow to the right shows that the remaining neurons form the thinned network used in the forward pass.

8 Concatenate / Merge
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- two input arrows merging into one output -->
  <polyline points="10,30 50,40" stroke="#74A3CE" stroke-width="5"/>
  <polyline points="10,50 50,40" stroke="#F5B478" stroke-width="5"/>
  <polyline points="50,40 130,40" stroke="#333" stroke-width="5" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <path d="M0,0 L6,3.5 L0,7 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">Concatenate</text>
</svg>
Reference

Concatenation combines features from multiple streams into a single tensor. In network diagrams the operation is depicted by lines merging together. For example, residual networks and multi‑branch architectures join parallel paths by concatenating their outputs before subsequent layers
cv-foundation.org
.

Rationale

Two coloured inputs join at a junction into a single black output arrow. This conveys that values from different sources are appended or concatenated. Colour coding can help distinguish the different input branches before they merge.

9 Split / Fork
Conceptual sketch
Reference

Concatenation combines features from multiple streams into a single tensor. In network diagrams the operation is depicted by lines merging together. For example, residual networks and multi‑branch architectures join parallel paths by concatenating their outputs before subsequent layers
cv-foundation.org
.

Rationale

Two coloured inputs join at a junction into a single black output arrow. This conveys that values from different sources are appended or concatenated. Colour coding can help distinguish the different input branches before they merge.

9 Split / Fork
Conceptual sketch
Reference

Split operations feed the same tensor into multiple subsequent layers. In graph diagrams a single line forks into several paths. This design mirrors practices in network‑visualisation tools such as Netron and TensorBoard.

Rationale

The thick horizontal line represents the input tensor. At the junction it forks into two coloured outputs, illustrating that the same data is replicated to multiple subsequent branches.

10 Residual / Skip Connection
Conceptual sketch
<svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg">
  <!-- main path -->
  <polyline points="10,40 80,40" stroke="#333" stroke-width="4"/>
  <!-- skip path (curved) -->
  <path d="M10,40 C30,20 50,60 70,40" stroke="#F5B478" fill="none" stroke-width="3"/>
  <!-- addition node -->
  <circle cx="80" cy="40" r="6" fill="#ffffff" stroke="#333" stroke-width="2"/>
  <text x="77" y="43" font-size="7" fill="#333">+</text>
  <!-- output arrow -->
  <polyline points="86,40 130,40" stroke="#333" stroke-width="4" marker-end="url(#arrow)"/>
  <defs>
    <marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <path d="M0,0 L6,3.5 L0,7 Z" fill="#333"/>
    </marker>
  </defs>
  <text x="5" y="15" font-size="10" fill="#333">Residual</text>
</svg>
eference

Residual networks recast the original mapping into a residual mapping F(x) + x so that stacked layers learn a residual function
cv-foundation.org
. Identity shortcut connections perform element‑wise addition of the input x with the output of the residual branch, allowing gradients to flow easily.

Rationale

The straight horizontal line is the main branch through the network. A curved skip path bypasses intermediate layers and feeds into an addition node (depicted as a circle with a “+”). The output arrow shows the combined signal F(x) + x. Colour differentiates the skip connection from the main path.