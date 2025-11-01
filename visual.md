Visual Vocabulary for Common Machine‑Learning Nodes

The following visual vocabulary proposes academically familiar icons for common neural‑network operations. Each icon is accompanied by a conceptual sketch, example SVG markup, reference citations and a short rationale explaining how the design reflects the underlying mathematical operation. The designs are minimalist so that they scale down to small sizes (≈80×60 px) and preserve recognisability in monochrome.

1 Flatten
Conceptual sketch

SVG markup
Reference

Convolutional‑network cheat sheets note that fully connected layers operate on a flattened 1‑D vector obtained by reshaping the convolutional feature map
stanford.edu
. The icon shows a 3‑D cube being unrolled into a single bar, matching textbook diagrams where the output of a convolution is “flattened” before the dense layer.

Rationale

In convolutional architectures, flattening converts a 3‑D feature map (height × width × channels) into a 1‑D vector. The stacked cube conveys the three spatial dimensions, while the horizontal bar on the right represents the vector fed into fully connected layers. The arrow communicates the transformation direction.

2 Embedding
Conceptual sketch

SVG markup
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

SVG markup
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

SVG markup
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

SVG markup
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

SVG markup
Reference

A simple recurrent neural network updates its hidden state by feeding the previous hidden state back into the next step. The state is updated using the current input and the previous hidden state, enabling sequence processing
colah.github.io
.

Rationale

The box represents the recurrent unit. The curved arrow looping from the output back into the box shows recurrence over time. Arrows entering from the left (input x_t) and exiting to the right (h_t) represent the flow of data through the sequence.

6.2 LSTM
Conceptual sketch

SVG markup
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

SVG markup
Reference

Gated recurrent units combine the input and forget mechanisms into update and reset gates. These gates modulate how much of the previous hidden state to keep and how much new information to incorporate, simplifying the LSTM architecture while maintaining performance
colah.github.io
colah.github.io
.

Rationale

Two circles labelled U (update) and R (reset) represent the GRU’s gates. The rectangular block to the right depicts the hidden state. As with the LSTM and RNN icons, arrows show the flow of input and output information.

7 Dropout
Conceptual sketch

SVG markup
Reference

Dropout randomly drops units and their connections during training to prevent co‑adaptation of feature detectors. Each unit is removed with probability p, resulting in a thinned network with only a fraction of the neurons active.

Rationale

The row of circles depicts neurons in a layer. Some circles are crossed out to indicate that they are “dropped” during training, matching the original dropout paper’s description. The arrow to the right shows that the remaining neurons form the thinned network used in the forward pass.

8 Concatenate / Merge
Conceptual sketch

SVG markup
Reference

Concatenation combines features from multiple streams into a single tensor. In network diagrams the operation is depicted by lines merging together. For example, residual networks and multi‑branch architectures join parallel paths by concatenating their outputs before subsequent layers
cv-foundation.org
.

Rationale

Two coloured inputs join at a junction into a single black output arrow. This conveys that values from different sources are appended or concatenated. Colour coding can help distinguish the different input branches before they merge.

9 Split / Fork
Conceptual sketch

SVG markup
Reference

Split operations feed the same tensor into multiple subsequent layers. In graph diagrams a single line forks into several paths. This design mirrors practices in network‑visualisation tools such as Netron and TensorBoard.

Rationale

The thick horizontal line represents the input tensor. At the junction it forks into two coloured outputs, illustrating that the same data is replicated to multiple subsequent branches.

10 Residual / Skip Connection
Conceptual sketch

SVG markup
Reference

Residual networks recast the original mapping into a residual mapping F(x) + x so that stacked layers learn a residual function
cv-foundation.org
. Identity shortcut connections perform element‑wise addition of the input x with the output of the residual branch, allowing gradients to flow easily.

Rationale

The straight horizontal line is the main branch through the network. A curved skip path bypasses intermediate layers and feeds into an addition node (depicted as a circle with a “+”). The output arrow shows the combined signal F(x) + x. Colour differentiates the skip connection from the main path.