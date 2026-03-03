import { useMemo, useRef, useState } from "react";

/** ===== THEME (soft dark, easy on eyes) ===== */
const THEME = {
  page: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950",
  header: "bg-slate-950/70 border-white/10",
  panel: "bg-white/5 border-white/10",
  panelHover: "hover:bg-white/7 hover:border-white/15",
  code: "bg-black/50 border-white/10",
  text: "text-white/90",
  textDim: "text-white/55",
  accent: "text-emerald-300",
};

/** ===== PATTERNS (Most-used + High ROI) ===== */
const PATTERNS = [
  /** 1) Two Pointers */
  {
    id: "two-pointers",
    name: "Two Pointers",
    icon: "⇄",
    color: "#4ECDC4",
    difficulty: "Easy–Med",
    category: "Arrays / Strings",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description:
      "Use two indices moving through the data (often from both ends). Works best when the array/string is sorted or when you can enforce an ordering to avoid nested loops.",
    whenToUse: [
      "Sorted array pair problems (sum, difference, closest)",
      "Palindrome checks (compare ends)",
      "Remove duplicates in-place",
      "Partitioning (Dutch National Flag)",
    ],
    keyInsight:
      "If data is sorted, you can move the pointer that makes progress toward the target and skip huge parts of the search space.",
    theory: [
      "Two pointers reduces O(n²) brute-force into O(n) by using structure (sortedness or monotonic movement).",
      "If current sum is too small → move left pointer right. Too large → move right pointer left.",
      "Often paired with sorting first: O(n log n) sort + O(n) scan.",
    ],
    template: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return (left, right)
        if s < target:
            left += 1
        else:
            right -= 1
    return None`,
    problems: [
      { name: "Two Sum II - Input Array Sorted", id: 167, diff: "Medium" },
      { name: "Valid Palindrome", id: 125, diff: "Easy" },
      { name: "3Sum", id: 15, diff: "Medium" },
      { name: "Container With Most Water", id: 11, diff: "Medium" },
    ],
    resources: [
      { title: "AlgoMaster – Patterns Overview", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
      { title: "NeetCode – Two Pointers", url: "https://neetcode.io" },
    ],
  },

  /** 2) Sliding Window */
  {
    id: "sliding-window",
    name: "Sliding Window",
    icon: "⊞",
    color: "#FF6B6B",
    difficulty: "Medium",
    category: "Arrays / Strings",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) or O(k)",
    description:
      "Maintain a contiguous window and move it across the array/string. Expand right, shrink left when constraints are violated.",
    whenToUse: [
      "Subarray/substring problems",
      "Longest/shortest segment meeting a condition",
      "Fixed window sums/averages",
      "Distinct/at-most-k character problems",
    ],
    keyInsight:
      "Never recompute from scratch. Update window state incrementally as pointers move.",
    theory: [
      "Two types: fixed-size windows (exact k) and variable-size windows (constraints).",
      "The core trick is maintaining counts/state so each pointer only moves forward → O(n).",
      "Common state: frequency map, sum, unique count, max count, etc.",
    ],
    template: `def longest_unique_substring(s):
    left = 0
    freq = {}
    best = 0

    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1

        while freq[s[right]] > 1:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1

        best = max(best, right - left + 1)

    return best`,
    problems: [
      { name: "Longest Substring Without Repeating Characters", id: 3, diff: "Medium" },
      { name: "Minimum Window Substring", id: 76, diff: "Hard" },
      { name: "Minimum Size Subarray Sum", id: 209, diff: "Medium" },
      { name: "Permutation in String", id: 567, diff: "Medium" },
    ],
    resources: [
      { title: "LeetCode Sliding Window Discussions", url: "https://leetcode.com/discuss/" },
      { title: "NeetCode – Sliding Window", url: "https://neetcode.io" },
    ],
  },

  /** 3) Prefix Sum */
  {
    id: "prefix-sum",
    name: "Prefix Sum",
    icon: "Σ",
    color: "#E8D44D",
    difficulty: "Easy",
    category: "Arrays / Strings",
    timeComplexity: "O(n) build, O(1) query",
    spaceComplexity: "O(n)",
    description:
      "Precompute cumulative totals so any range sum can be answered in O(1).",
    whenToUse: [
      "Range sum queries",
      "Subarray sum problems",
      "Running totals / cumulative counts",
      "2D grid sum queries (prefix matrix)",
    ],
    keyInsight: "sum(i..j) = prefix[j+1] - prefix[i].",
    theory: [
      "Prefix sums turn repeated range computations into constant-time queries.",
      "Often combined with hashing: prefix sum + hashmap count = powerful for subarray sum equals K.",
      "In 2D, prefix matrix enables O(1) rectangle sums.",
    ],
    template: `def build_prefix(nums):
    prefix = [0]
    for x in nums:
        prefix.append(prefix[-1] + x)
    return prefix

def range_sum(prefix, i, j):
    return prefix[j + 1] - prefix[i]`,
    problems: [
      { name: "Range Sum Query - Immutable", id: 303, diff: "Easy" },
      { name: "Subarray Sum Equals K", id: 560, diff: "Medium" },
      { name: "Contiguous Array", id: 525, diff: "Medium" },
    ],
    resources: [
      { title: "LeetCode Study Plans", url: "https://leetcode.com/studyplan/" },
      { title: "AlgoMaster – Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
    ],
  },

  /** 4) Hash Map / Frequency */
  {
    id: "hashmap-frequency",
    name: "Hash Map / Frequency",
    icon: "🗂️",
    color: "#60A5FA",
    difficulty: "Easy–Med",
    category: "Core Technique",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "Use a hash map to count occurrences, remember last seen positions, or store prefix states to avoid nested loops.",
    whenToUse: [
      "Counting frequencies",
      "Detecting duplicates / first unique",
      "Two Sum (unsorted)",
      "Prefix-sum counting (subarray sum equals k)",
    ],
    keyInsight:
      "A hash map turns 'search in past' from O(n) into average O(1).",
    theory: [
      "When you need to remember something about elements you've already visited, hashing is usually the first tool.",
      "Common patterns: frequency map, last index map, seen set, prefix-state counts.",
      "Many problems become one pass when you store the right key.",
    ],
    template: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return (seen[need], i)
        seen[x] = i
    return None

def subarray_sum_k(nums, k):
    count = 0
    prefix = 0
    freq = {0: 1}
    for x in nums:
        prefix += x
        count += freq.get(prefix - k, 0)
        freq[prefix] = freq.get(prefix, 0) + 1
    return count`,
    problems: [
      { name: "Two Sum", id: 1, diff: "Easy" },
      { name: "First Unique Character in a String", id: 387, diff: "Easy" },
      { name: "Subarray Sum Equals K", id: 560, diff: "Medium" },
    ],
    resources: [
      { title: "NeetCode – Hashing", url: "https://neetcode.io" },
      { title: "LeetCode Study Plans", url: "https://leetcode.com/studyplan/" },
    ],
  },

  /** 5) Binary Search */
  {
    id: "binary-search",
    name: "Binary Search",
    icon: "🔍",
    color: "#F97316",
    difficulty: "Easy–Hard",
    category: "Sorting / Searching",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description:
      "Halve the search space each step. Works on sorted arrays and on any monotonic true/false boundary ('binary search on answer').",
    whenToUse: [
      "Find element in sorted array",
      "First/last occurrence",
      "Search rotated sorted arrays",
      "Min feasible / max feasible (answer-space search)",
    ],
    keyInsight:
      "If feasibility is monotonic (false → true), you can binary search the boundary.",
    theory: [
      "Binary search is not just for 'find element'. It's a boundary finder in any monotonic space.",
      "Be careful with mid computation and loop invariants (lo/hi updates).",
      "Common variants: lower_bound, upper_bound, rotated search, answer space.",
    ],
    template: `def lower_bound(arr, target):
    lo, hi = 0, len(arr)  # hi is exclusive
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo

def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
    problems: [
      { name: "Binary Search", id: 704, diff: "Easy" },
      { name: "Search in Rotated Sorted Array", id: 33, diff: "Medium" },
      { name: "Koko Eating Bananas", id: 875, diff: "Medium" },
    ],
    resources: [
      { title: "LeetCode Binary Search Study Plan", url: "https://leetcode.com/studyplan/" },
      { title: "NeetCode – Binary Search", url: "https://neetcode.io" },
    ],
  },

  /** 6) DFS */
  {
    id: "dfs",
    name: "DFS (Depth-First Search)",
    icon: "🌲",
    color: "#10B981",
    difficulty: "Medium",
    category: "Trees / Graphs",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(h) recursion stack",
    description:
      "Explore deep before backtracking. Use recursion or an explicit stack. Core tool for traversals, components, path search, and backtracking-style graph traversal.",
    whenToUse: [
      "Tree traversals",
      "Connected components (islands)",
      "Path existence",
      "Topological detection via DFS finishing times",
    ],
    keyInsight:
      "Mark visited to avoid cycles. Backtracking unmarks only when exploring multiple paths and revisits are allowed.",
    theory: [
      "DFS naturally fits recursion (call stack = traversal stack).",
      "In graphs, always track visited to avoid infinite loops.",
      "In grid problems, DFS often becomes flood fill (4-dir or 8-dir).",
    ],
    template: `def dfs_grid(grid, r, c, visited):
    if (r < 0 or r >= len(grid) or
        c < 0 or c >= len(grid[0]) or
        (r, c) in visited or grid[r][c] == 0):
        return
    visited.add((r, c))
    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
        dfs_grid(grid, r+dr, c+dc, visited)`,
    problems: [
      { name: "Number of Islands", id: 200, diff: "Medium" },
      { name: "Maximum Depth of Binary Tree", id: 104, diff: "Easy" },
      { name: "Path Sum", id: 112, diff: "Easy" },
    ],
    resources: [
      { title: "NeetCode – Trees & Graphs", url: "https://neetcode.io" },
      { title: "LeetCode Study Plans", url: "https://leetcode.com/studyplan/" },
    ],
  },

  /** 7) BFS */
  {
    id: "bfs",
    name: "BFS (Breadth-First Search)",
    icon: "🌊",
    color: "#3B82F6",
    difficulty: "Medium",
    category: "Trees / Graphs",
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(w) queue width",
    description:
      "Explore level-by-level using a queue. Guarantees shortest path in unweighted graphs/grids.",
    whenToUse: [
      "Shortest path in unweighted graph/grid",
      "Level order traversal",
      "Multi-source BFS (rotting oranges)",
      "Minimum steps / distance problems",
    ],
    keyInsight:
      "First time you reach a node in BFS is the shortest distance (unweighted).",
    theory: [
      "Queue is mandatory; process in layers to track distance.",
      "Multi-source BFS starts queue with multiple nodes.",
      "Use visited to avoid revisiting nodes.",
    ],
    template: `from collections import deque

def bfs_shortest_steps(grid, start):
    q = deque([start])
    visited = {start}
    steps = 0
    while q:
        for _ in range(len(q)):
            r, c = q.popleft()
            # check goal here if needed
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if (nr, nc) in visited: 
                    continue
                # validate bounds/walls
                visited.add((nr, nc))
                q.append((nr, nc))
        steps += 1
    return steps`,
    problems: [
      { name: "Binary Tree Level Order Traversal", id: 102, diff: "Medium" },
      { name: "Rotting Oranges", id: 994, diff: "Medium" },
      { name: "Word Ladder", id: 127, diff: "Hard" },
    ],
    resources: [
      { title: "NeetCode – BFS", url: "https://neetcode.io" },
      { title: "LeetCode Study Plans", url: "https://leetcode.com/studyplan/" },
    ],
  },

  /** 8) Backtracking */
  {
    id: "backtracking",
    name: "Backtracking",
    icon: "↩",
    color: "#8B5CF6",
    difficulty: "Med–Hard",
    category: "Backtracking",
    timeComplexity: "O(branch^depth)",
    spaceComplexity: "O(depth)",
    description:
      "Systematically build solutions by choosing an option, exploring, then undoing it. Pruning removes impossible branches early.",
    whenToUse: [
      "All combinations/permutations/subsets",
      "Constraints like Sudoku / N-Queens",
      "Path search with choices",
      "Generate valid parentheses",
    ],
    keyInsight: "Choose → Explore → Unchoose. Prune early.",
    theory: [
      "Backtracking is DFS over the decision tree of choices.",
      "Pruning is what makes it fast enough: reject partial solutions early.",
      "Always define: state, choices, constraints, goal.",
    ],
    template: `def backtrack(nums):
    res = []
    path = []

    def dfs(start):
        # record current state (if needed)
        res.append(path[:])

        for i in range(start, len(nums)):
            path.append(nums[i])      # choose
            dfs(i + 1)                # explore
            path.pop()                # unchoose

    dfs(0)
    return res`,
    problems: [
      { name: "Subsets", id: 78, diff: "Medium" },
      { name: "Permutations", id: 46, diff: "Medium" },
      { name: "Generate Parentheses", id: 22, diff: "Medium" },
    ],
    resources: [
      { title: "NeetCode – Backtracking", url: "https://neetcode.io" },
      { title: "AlgoMaster – Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
    ],
  },

  /** 9) Dynamic Programming */
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    icon: "🧩",
    color: "#FB923C",
    difficulty: "Med–Hard",
    category: "Dynamic Programming",
    timeComplexity: "Varies",
    spaceComplexity: "Varies",
    description:
      "Solve overlapping subproblems once and reuse results. Define dp state clearly before coding.",
    whenToUse: [
      "Optimization (min/max)",
      "Counting ways",
      "Overlapping subproblems + optimal substructure",
      "LCS/LIS/edit distance/grid paths",
    ],
    keyInsight:
      "If brute force repeats the same work, memoize it → then convert to bottom-up.",
    theory: [
      "DP recipe: define state → transition → base cases → compute order.",
      "Top-down (memo) is usually easiest to derive; bottom-up is often faster/cleaner.",
      "Common categories: 1D DP, 2D DP, interval DP, bitmask DP.",
    ],
    template: `def coin_change_min(coins, amount):
    INF = 10**9
    dp = [INF] * (amount + 1)
    dp[0] = 0

    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], dp[a - c] + 1)

    return dp[amount] if dp[amount] != INF else -1`,
    problems: [
      { name: "Climbing Stairs", id: 70, diff: "Easy" },
      { name: "House Robber", id: 198, diff: "Medium" },
      { name: "Coin Change", id: 322, diff: "Medium" },
      { name: "Longest Increasing Subsequence", id: 300, diff: "Medium" },
    ],
    resources: [
      { title: "LeetCode DP Study Plan", url: "https://leetcode.com/studyplan/" },
      { title: "NeetCode – DP", url: "https://neetcode.io" },
    ],
  },

  /** 10) Monotonic Stack */
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    icon: "📈",
    color: "#EF4444",
    difficulty: "Medium",
    category: "Stacks / Queues",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    description:
      "A stack that stays increasing/decreasing. Pop when current breaks monotonic order to answer 'next greater/smaller' style questions.",
    whenToUse: [
      "Next greater element",
      "Daily temperatures / stock span",
      "Largest rectangle in histogram",
      "Trapping rain water (stack version)",
    ],
    keyInsight:
      "Each index is pushed once and popped once → total O(n).",
    theory: [
      "Store indices (not values) so you can compute distances/areas.",
      "Choose increasing vs decreasing based on 'greater' or 'smaller' query.",
      "The pop action is where you finalize answers for those indices.",
    ],
    template: `def next_greater(nums):
    res = [-1] * len(nums)
    st = []  # stack of indices
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            idx = st.pop()
            res[idx] = x
        st.append(i)
    return res`,
    problems: [
      { name: "Daily Temperatures", id: 739, diff: "Medium" },
      { name: "Largest Rectangle in Histogram", id: 84, diff: "Hard" },
      { name: "Next Greater Element I", id: 496, diff: "Easy" },
    ],
    resources: [
      { title: "NeetCode – Stack", url: "https://neetcode.io" },
      { title: "AlgoMaster – Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
    ],
  },

  /** 11) Heap / Priority Queue (Top K) */
  {
    id: "heap-topk",
    name: "Heap / Top K",
    icon: "🏆",
    color: "#FBBF24",
    difficulty: "Medium",
    category: "Heaps / Priority Queues",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    description:
      "Use a heap to keep only the k best candidates. Min-heap for k-largest, max-heap for k-smallest (or invert signs).",
    whenToUse: [
      "Kth largest/smallest",
      "Top K frequent",
      "Closest points",
      "Scheduling with priorities",
    ],
    keyInsight:
      "Maintain heap size k. The root represents the boundary element (kth).",
    theory: [
      "Heaps give fast access to smallest/largest element without full sorting.",
      "For k-largest: keep a min-heap of size k and pop when exceeded.",
      "For frequencies: heap over (count, item).",
    ],
    template: `import heapq

def kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for x in nums[k:]:
        if x > heap[0]:
            heapq.heapreplace(heap, x)
    return heap[0]`,
    problems: [
      { name: "Kth Largest Element in an Array", id: 215, diff: "Medium" },
      { name: "Top K Frequent Elements", id: 347, diff: "Medium" },
      { name: "K Closest Points to Origin", id: 973, diff: "Medium" },
    ],
    resources: [
      { title: "NeetCode – Heap/PQ", url: "https://neetcode.io" },
      { title: "DesignGurus – Patterns", url: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
    ],
  },

  /** 12) K-way Merge */
  {
    id: "k-way-merge",
    name: "K-way Merge",
    icon: "🔀",
    color: "#34D399",
    difficulty: "Medium–Hard",
    category: "Heaps / Priority Queues",
    timeComplexity: "O(n log k)",
    spaceComplexity: "O(k)",
    description:
      "Merge k sorted lists by pushing the head of each list into a min-heap, popping the smallest, then pushing its successor.",
    whenToUse: [
      "Merge k sorted linked lists/arrays",
      "Kth smallest in sorted matrix",
      "Smallest range covering k lists",
    ],
    keyInsight:
      "Heap always holds one candidate per list → pop min, push next from that list.",
    theory: [
      "This avoids flattening all lists then sorting (O(n log n)).",
      "Time is O(total_elements * log k).",
      "Works in streaming fashion (good for large data).",
    ],
    template: `import heapq

def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))

    out = []
    while heap:
        val, li, ei = heapq.heappop(heap)
        out.append(val)
        if ei + 1 < len(lists[li]):
            heapq.heappush(heap, (lists[li][ei+1], li, ei+1))
    return out`,
    problems: [
      { name: "Merge k Sorted Lists", id: 23, diff: "Hard" },
      { name: "Kth Smallest Element in a Sorted Matrix", id: 378, diff: "Medium" },
    ],
    resources: [
      { title: "DesignGurus – Patterns", url: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
      { title: "NeetCode – Heap", url: "https://neetcode.io" },
    ],
  },

  /** 13) Intervals */
  {
    id: "intervals",
    name: "Intervals",
    icon: "⟷",
    color: "#EC4899",
    difficulty: "Medium",
    category: "Sorting / Searching",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description:
      "Sort intervals by start time and merge overlaps. Also used for meeting rooms and conflict detection.",
    whenToUse: [
      "Merging overlapping times",
      "Meeting room scheduling",
      "Insert interval",
      "Find gaps or conflicts",
    ],
    keyInsight:
      "Sort by start. If current.start <= last.end → merge.",
    theory: [
      "Sorting is the key; without it, overlap logic becomes complicated.",
      "Keep a running 'active' interval and merge into it.",
      "Many scheduling problems reduce to sorting endpoints.",
    ],
    template: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for s, e in intervals:
        if not merged or s > merged[-1][1]:
            merged.append([s, e])
        else:
            merged[-1][1] = max(merged[-1][1], e)
    return merged`,
    problems: [
      { name: "Merge Intervals", id: 56, diff: "Medium" },
      { name: "Insert Interval", id: 57, diff: "Medium" },
      { name: "Meeting Rooms II", id: 253, diff: "Medium" },
    ],
    resources: [
      { title: "AlgoMaster – Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
      { title: "NeetCode – Intervals", url: "https://neetcode.io" },
    ],
  },

  /** 14) Union Find */
  {
    id: "union-find",
    name: "Union Find (Disjoint Set)",
    icon: "🔗",
    color: "#7C3AED",
    difficulty: "Medium",
    category: "Trees / Graphs",
    timeComplexity: "≈ O(α(n))",
    spaceComplexity: "O(n)",
    description:
      "Maintain disjoint sets with find/union. Great for connected components and cycle detection in undirected graphs.",
    whenToUse: [
      "Connected components",
      "Cycle detection in undirected graph",
      "Grouping / merging accounts",
      "Kruskal's MST",
    ],
    keyInsight:
      "Path compression + union by rank makes operations almost constant time.",
    theory: [
      "Union-Find is perfect when edges arrive and you need to quickly know if two nodes are connected.",
      "find(x) returns representative parent; union merges two sets.",
      "If union(u, v) fails (same root), edge creates a cycle.",
    ],
    template: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0]*n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`,
    problems: [
      { name: "Number of Provinces", id: 547, diff: "Medium" },
      { name: "Redundant Connection", id: 684, diff: "Medium" },
      { name: "Accounts Merge", id: 721, diff: "Medium" },
    ],
    resources: [
      { title: "NeetCode – Union Find", url: "https://neetcode.io" },
      { title: "DesignGurus – Patterns", url: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
    ],
  },

  /** 15) Greedy */
  {
    id: "greedy",
    name: "Greedy",
    icon: "💰",
    color: "#22C55E",
    difficulty: "Med–Hard",
    category: "Optimization",
    timeComplexity: "O(n log n) typical",
    spaceComplexity: "O(1) to O(n)",
    description:
      "Make the best local choice at each step. Works when the problem has greedy-choice property + optimal substructure.",
    whenToUse: [
      "Interval scheduling",
      "Jump game variants",
      "Minimize/maximize with sorting",
      "Pick smallest/largest next step",
    ],
    keyInsight:
      "Greedy works only when local optimal choices lead to global optimal solution.",
    theory: [
      "Try greedy when you can argue an exchange argument or prove optimal substructure.",
      "Sorting by end time is a classic for selecting max non-overlapping intervals.",
      "If greedy fails, usually DP is needed.",
    ],
    template: `def max_non_overlapping(intervals):
    intervals.sort(key=lambda x: x[1])  # by end
    count = 0
    last_end = float("-inf")
    for s, e in intervals:
        if s >= last_end:
            count += 1
            last_end = e
    return count`,
    problems: [
      { name: "Jump Game", id: 55, diff: "Medium" },
      { name: "Gas Station", id: 134, diff: "Medium" },
      { name: "Boats to Save People", id: 881, diff: "Medium" },
    ],
    resources: [
      { title: "DesignGurus – Greedy Patterns", url: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
      { title: "NeetCode – Greedy", url: "https://neetcode.io" },
    ],
  },

  /** 16) Trie */
  {
    id: "trie",
    name: "Trie (Prefix Tree)",
    icon: "🌳",
    color: "#0EA5E9",
    difficulty: "Medium",
    category: "Trees / Graphs",
    timeComplexity: "O(m) per op",
    spaceComplexity: "O(total chars)",
    description:
      "Store words in a tree of characters. Shared prefixes share nodes. Fast prefix lookups and autocomplete.",
    whenToUse: [
      "Autocomplete / search suggestions",
      "Prefix matches",
      "Word dictionary queries",
      "Word search (with DFS)",
    ],
    keyInsight:
      "Insert/search are O(word length), not dependent on number of words.",
    theory: [
      "Each node stores children map and an end-of-word flag.",
      "Perfect for prefix queries: startsWith(prefix).",
      "Combine with DFS on grid for Word Search II.",
    ],
    template: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.end = True

    def search(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return node.end

    def startsWith(self, pref):
        node = self.root
        for ch in pref:
            if ch not in node.children:
                return False
            node = node.children[ch]
        return True`,
    problems: [
      { name: "Implement Trie (Prefix Tree)", id: 208, diff: "Medium" },
      { name: "Word Search II", id: 212, diff: "Hard" },
      { name: "Replace Words", id: 648, diff: "Medium" },
    ],
    resources: [
      { title: "NeetCode – Tries", url: "https://neetcode.io" },
      { title: "LeetCode Study Plans", url: "https://leetcode.com/studyplan/" },
    ],
  },

  /** 17) Fast & Slow Pointers */
  {
    id: "fast-slow",
    name: "Fast & Slow Pointers",
    icon: "🐢",
    color: "#A78BFA",
    difficulty: "Medium",
    category: "Linked Lists",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description:
      "Two pointers with different speeds. Detect cycles and find middle nodes.",
    whenToUse: [
      "Cycle detection (Floyd)",
      "Find middle of list",
      "Happy number cycle detection",
      "Find start of cycle",
    ],
    keyInsight:
      "If fast meets slow → cycle exists. Reset one pointer to head to find entry.",
    theory: [
      "Floyd's algorithm detects cycle without extra memory.",
      "Middle node: slow moves 1 step, fast moves 2 steps.",
      "Cycle entry: after meeting, set one pointer to head, move both 1 step; they meet at entry.",
    ],
    template: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    problems: [
      { name: "Linked List Cycle", id: 141, diff: "Easy" },
      { name: "Linked List Cycle II", id: 142, diff: "Medium" },
      { name: "Middle of the Linked List", id: 876, diff: "Easy" },
    ],
    resources: [
      { title: "NeetCode – Linked List", url: "https://neetcode.io" },
      { title: "AlgoMaster – Patterns", url: "https://blog.algomaster.io/p/15-leetcode-patterns" },
    ],
  },

  /** 18) In-place Linked List Reversal */
  {
    id: "in-place-reversal",
    name: "In-place Linked List Reversal",
    icon: "🔄",
    color: "#06B6D4",
    difficulty: "Medium",
    category: "Linked Lists",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    description:
      "Reverse pointers in-place using prev/curr/next. Used for full reverse, partial reverse, or k-group reverse.",
    whenToUse: [
      "Reverse list",
      "Reverse sublist between m..n",
      "Reverse in groups of k",
      "Palindrome list check",
    ],
    keyInsight:
      "Save next → reverse curr.next → advance prev/curr.",
    theory: [
      "Three pointers: prev, curr, nxt.",
      "Every node is visited once; no extra memory required.",
      "Sublist reversal uses a dummy node to simplify head changes.",
    ],
    template: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    problems: [
      { name: "Reverse Linked List", id: 206, diff: "Easy" },
      { name: "Reverse Linked List II", id: 92, diff: "Medium" },
      { name: "Reverse Nodes in k-Group", id: 25, diff: "Hard" },
    ],
    resources: [
      { title: "NeetCode – Linked List", url: "https://neetcode.io" },
      { title: "DesignGurus – Patterns", url: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
    ],
  },
];

/** ===== DERIVED DATA ===== */
const CATEGORIES = [...new Set(PATTERNS.map((p) => p.category))];

const STUDY_TIPS = [
  { title: "Study patterns, not problems", desc: "Memorize the template and decision rule. New problems become variations you recognize." },
  { title: "Spaced repetition", desc: "Re-solve after 3 days → 1 week → 2 weeks. The 3rd attempt is where speed and confidence jump." },
  { title: "Decision framework", desc: "Sorted? → Two Pointers/Binary Search. Subarray? → Sliding Window/Prefix Sum. Choices? → Backtracking/DP." },
  { title: "Start brute-force, then optimize", desc: "For DP/graphs, start simple; then add memo/visited/heap to remove repeated work." },
  { title: "Track weaknesses", desc: "Log pattern + what failed (edge cases). Review weekly and re-solve those first." },
  { title: "Timed practice", desc: "Do a weekly timed set. Speed comes from pattern recall and reducing hesitation." },
];

const DECISION_TREE = [
  { q: "Is input sorted (or can be sorted)?", a: "Two Pointers / Binary Search" },
  { q: "Is it subarray / substring?", a: "Sliding Window / Prefix Sum" },
  { q: "Need to count things / remember past?", a: "Hash Map / Frequency" },
  { q: "Tree or graph traversal?", a: "DFS / BFS" },
  { q: "Need all combinations/permutations?", a: "Backtracking" },
  { q: "Optimization with overlapping subproblems?", a: "Dynamic Programming" },
  { q: "Need next greater/smaller style?", a: "Monotonic Stack" },
  { q: "Need Top K / scheduling by priority?", a: "Heap / Priority Queue" },
  { q: "Overlapping time ranges?", a: "Intervals" },
  { q: "Connected components in undirected graph?", a: "Union Find" },
  { q: "Prefix word search / autocomplete?", a: "Trie" },
  { q: "Linked list cycle or middle?", a: "Fast & Slow" },
  { q: "Linked list reversal?", a: "In-place Reversal" },
  { q: "Does greedy seem provably correct?", a: "Greedy" },
];

function DiffBadge({ diff }) {
  const c = {
    Easy: "bg-emerald-900/40 text-emerald-200 border-emerald-700/30",
    Medium: "bg-amber-900/40 text-amber-200 border-amber-700/30",
    Hard: "bg-rose-900/40 text-rose-200 border-rose-700/30",
  };
  const key = diff.includes("Hard")
    ? "Hard"
    : diff.includes("Med")
    ? "Medium"
    : "Easy";
  return (
    <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${c[key]}`}>
      {diff}
    </span>
  );
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className={`${THEME.code} border rounded-lg p-4 overflow-x-auto text-sm leading-relaxed`} style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#A7F3D0" }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-white/10 hover:bg-white/15 text-white/70 rounded border border-white/10"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}

function PatternDetail({ pattern }) {
  return (
    <div className="space-y-6" key={pattern.id}>
      <div>
        <div className="flex items-start gap-3 mb-2">
          <span className="text-3xl">{pattern.icon}</span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-white tracking-tight">{pattern.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <DiffBadge diff={pattern.difficulty} />
              <span className="text-xs font-mono text-white/35">{pattern.timeComplexity}</span>
              <span className="text-xs font-mono text-white/35">Sp: {pattern.spaceComplexity}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/55 border border-white/10">{pattern.category}</span>
            </div>
          </div>
        </div>
        <p className="text-white/70 text-sm leading-relaxed">{pattern.description}</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border-l-2 border-emerald-400/40 pl-4 py-2.5 rounded-r-lg">
        <p className="text-xs uppercase tracking-wider text-emerald-200/70 font-semibold mb-0.5">Key Insight</p>
        <p className="text-white/80 text-sm">{pattern.keyInsight}</p>
      </div>

      {pattern.theory?.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold">Theory</h3>
          {pattern.theory.map((t, i) => (
            <div key={i} className="flex gap-2 text-sm text-white/65">
              <span className="text-white/25 mt-0.5">•</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold">When to Use</h3>
        {pattern.whenToUse.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-white/25 mt-0.5 text-xs">▸</span>
            <span className="text-white/65 text-sm">{item}</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Code Template (Python)</h3>
        <CodeBlock code={pattern.template} />
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Practice Problems</h3>
        <div className="grid gap-2">
          {pattern.problems.map((p, i) => (
            <a
              key={i}
              href={`https://leetcode.com/problems/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}/`}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between ${THEME.card} border rounded-lg px-3 py-2 transition-all ${THEME.cardHover}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-white/25 font-mono text-xs w-5">{i + 1}</span>
                <span className="text-white/80 text-sm truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <DiffBadge diff={p.diff} />
                <span className="text-white/30 text-xs">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Resources</h3>
        {pattern.resources.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-sky-300/70 hover:text-sky-200 transition-colors mb-1"
          >
            ↗ {r.title}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function LeetcodePatternsApp() {
  const [active, setActive] = useState(PATTERNS[0]);
  const [tab, setTab] = useState("patterns");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const detailRef = useRef(null);

  const filtered = useMemo(() => {
    return PATTERNS.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || p.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [search, catFilter]);

  const handleClick = (p) => {
    setActive(p);
    setTab("patterns");
    // Scroll to top of details when selecting
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className={`min-h-screen ${THEME.page} text-white flex flex-col`} style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      `}</style>

      {/* sticky header */}
      <header className={`border-b ${THEME.header} backdrop-blur-xl sticky top-0 z-50`}>
        <div className="w-full max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              <span className="text-white/90">leet</span>
              <span className="text-amber-300">patterns</span>
              <span className="text-white/20">.dev</span>
            </h1>
            <p className="text-xs text-white/35">
              {PATTERNS.length} patterns · {PATTERNS.reduce((a, p) => a + p.problems.length, 0)} problems
            </p>
          </div>

          <div className="flex gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
            {[
              { k: "patterns", l: "Patterns" },
              { k: "decide", l: "Decision Tree" },
              { k: "map", l: "Map" },
              { k: "tips", l: "Study Guide" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  tab === t.k ? "bg-white/12 text-white" : "text-white/45 hover:text-white/70"
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* normal page scroll (no independent scroll bars) */}
      <main className="w-full max-w-screen-2xl mx-auto px-6 py-6 flex-1">
        {tab === "patterns" && (
          <div className="flex gap-6">
            {/* left */}
            <aside className="w-72 shrink-0 space-y-3">
              <input
                type="text"
                placeholder="Search patterns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25"
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              />

              <div className="flex flex-wrap gap-1.5">
                {["All", ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={`text-xs px-2 py-1 rounded border transition-all ${
                      catFilter === c
                        ? "bg-white/12 border-white/20 text-white/85"
                        : "bg-transparent border-white/10 text-white/40 hover:text-white/60"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleClick(p)}
                    className={`text-left w-full px-3 py-3 rounded-xl border transition-all ${
                      active.id === p.id ? "border-white/20 bg-white/8" : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white/85 truncate">{p.name}</p>
                        <p className="text-xs text-white/35 font-mono truncate">{p.timeComplexity}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full shrink-0 opacity-70" style={{ backgroundColor: p.color }} />
                    </div>
                  </button>
                ))}

                {filtered.length === 0 && <p className="text-xs text-white/35 text-center py-4">No patterns found</p>}
              </div>
            </aside>

            {/* right */}
            <section className="flex-1">
              <div ref={detailRef} />
              <PatternDetail pattern={active} />
            </section>
          </div>
        )}

        {tab === "decide" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">Pattern Decision Framework</h2>
            <p className="text-white/45 text-sm mb-6">
              Walk through these questions for any new problem. First “YES” gives a strong starting pattern.
            </p>

            <div className="space-y-3">
              {DECISION_TREE.map((node, i) => (
                <div key={i} className={`${THEME.card} border rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-white/8 border border-white/15 flex items-center justify-center text-xs font-mono text-white/55">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white/75 text-sm">{node.q}</p>
                      <div className="mt-1 inline-flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-emerald-900/25 border border-emerald-700/25 text-emerald-200/80">
                          → {node.a}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "map" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">Pattern → Category Map</h2>
            <p className="text-white/45 text-sm mb-6">Which patterns show up in which type of problems.</p>

            <div className="space-y-4">
              {CATEGORIES.map((cat) => (
                <div key={cat} className={`${THEME.card} border rounded-xl p-4`}>
                  <div className="flex items-start gap-4">
                    <span className="text-xs text-white/45 font-mono w-44 shrink-0 pt-1">{cat}</span>
                    <div className="flex flex-wrap gap-2">
                      {PATTERNS.filter((p) => p.category === cat).map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActive(p);
                            setTab("patterns");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
                          style={{ backgroundColor: p.color + "18" }}
                        >
                          {p.icon} {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "tips" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">How to Get Better</h2>
            <p className="text-white/45 text-sm mb-6">Simple strategies that improve speed + accuracy fast.</p>

            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              {STUDY_TIPS.map((t, i) => (
                <div key={i} className={`${THEME.card} border rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-white/30 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <h4 className="text-white/90 text-sm font-semibold">{t.title}</h4>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className={`${THEME.card} border rounded-xl p-5`}>
              <h3 className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-3">Recommended Links</h3>
              {[
                { t: "NeetCode.io — Roadmap & Video Solutions", u: "https://neetcode.io" },
                { t: "LeetCode Official Study Plans", u: "https://leetcode.com/studyplan/" },
                { t: "AlgoMaster — 15 LeetCode Patterns", u: "https://blog.algomaster.io/p/15-leetcode-patterns" },
                { t: "DesignGurus — Coding Patterns", u: "https://www.designgurus.io/blog/coding-patterns-for-tech-interviews" },
              ].map((r, i) => (
                <a key={i} href={r.u} target="_blank" rel="noopener noreferrer" className="block text-sm text-sky-300/70 hover:text-sky-200 transition-colors mb-1">
                  ↗ {r.t}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}